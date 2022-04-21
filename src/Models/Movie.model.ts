import { injectable, inject, delay } from 'tsyringe';
import { MysqlDatabase } from '@Lib/Mysql/index';
import { BaseModel } from './BaseModel.model';

export interface MovieData {
	movie_id:number;
	title:string;
	poster_path:string;
	release_date:number;
    runtime:number;
    ratings:string;
	vote_average:number | null;
    director_id:number | null;
    director_data:string;
    actor_id:number | null;
    actor_data:string;
	year:number;
	genres_ids:string;
}

@injectable()
export class MovieModel extends BaseModel<MovieData> {

	protected keys:string[] = [ 'movie_id', 'title', 'poster_path', 'release_date', 'runtime', 'ratings', 'vote_average', 'director_id', 'director_data', 'actor_id', 'actor_data', 'year', 'genres_ids' ];
	protected primaryKey:string = 'movie_id';

	constructor(@inject(delay(() => MysqlDatabase)) db:MysqlDatabase) {
		super(db, 'movies');
	}

	public async check(id:number | string):Promise<boolean> {
		return !!(await this.find(id));
	}

}