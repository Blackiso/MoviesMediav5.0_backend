import { inArrayOfObjects } from '@Helpers/index';
import { Movie, MovieDetails, MovieListResult } from '@Lib/TMDB';
import { CollectionModel } from '@Models/index';
import { injectable, singleton } from 'tsyringe';
import { AuthenticationService } from './Authentication.service';


@singleton()
@injectable()
export class MoviesService {
	
	constructor(private collectionModel:CollectionModel, private authService:AuthenticationService) {}

    public async setMoviesCollection(movies:Array<Movie | MovieDetails>):Promise<Array<Movie | MovieDetails>> {

        if (this.authService.isAuth()) {
            let ids = movies.map(movie => movie.id);
            let collection_data = await this.collectionModel.getByIds(ids, this.authService.getUser().id);

            if (collection_data.length !== 0) {
                movies = movies.map(movie => {
                    let collection = inArrayOfObjects(collection_data, 'movie_id', movie.id);
                    if (collection) {
                        movie.setCollection(collection);
                    }
                    return movie;
                });
            }
        } 

        return movies;
    }

	
}