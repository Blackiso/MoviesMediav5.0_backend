import { Movie } from './Movie';

export interface Director {
	id:number,
	name:string,
	profile_path:string
}

export class MovieDetails extends Movie {

	public backdrop_path:string;
	public budget:number;
	public overview:string;
	public tagline:string;
	public production_companies:Array<any>;
	public production_companies_string:string;
	public revenue:number;
	public runtime:number;
	public similar:Array<Movie>;
	public trailer:any = null;
	public ratings:string;
	public directors:Array<Director> = [];
	public cast:Array<any> = [];
	public genres:string;
	public genres_ids:string;

	constructor (data:any) {
		super(data);

		this.overview = data.overview;
		this.tagline = data.tagline;
		this.backdrop_path = data.backdrop_path;
		this.budget = data.budget;
		this.production_companies = data.production_companies;
		this.revenue = data.revenue;
		this.runtime = data.runtime;
		this.genres = data.genres.map(x => x.name).join(', ');
		this.genres_ids = data.genres.map(x => x.id).join(', ');
		this.cast = data.credits.cast;
		this.similar = data.similar.results.map(x => new Movie(x));
		this.production_companies_string = data.production_companies.map(x => x.name).join(', ')+'.';

		for (let i = 0; i < data.videos.results.length; i++) {
			if (data.videos.results[i].type == 'Trailer' && data.videos.results[i].site == 'YouTube') {
				this.trailer = {
					name: data.videos.results[i].name,
					url: 'https://www.youtube.com/embed/'+data.videos.results[i].key
				}
				break;
			}
		}

		for (let i = 0; i < data.release_dates.results.length; i++) {
			if (data.release_dates.results[i].iso_3166_1 == 'US') {
				if (data.release_dates.results[i].release_dates[0]) {
					this.ratings = data.release_dates.results[i].release_dates[0].certification;
				}else {
					this.ratings = 'NAN';
				}
			}
		}

		for (let i = 0; i < data.credits.crew.length; i++) {
			if (data.credits.crew[i].job == 'Director') {
				let obj:Director = {
					id: data.credits.crew[i].id,
					name: data.credits.crew[i].name,
					profile_path: data.credits.crew[i].profile_path
				}
				this.directors.push(obj);
			}
		}
	}

}