import { injectable, inject, delay } from 'tsyringe';
import { MysqlDatabase } from '@Lib/Mysql/index';
import { BaseModel } from './BaseModel.model';
import { User } from './User.model';
import { PAGE_LIMIT } from '@Config/index';
import { Movie } from '@Lib/TMDB';
import { parseCollectionFilterQuery, parseCollectionOrderQuery } from '@Helpers/index';

export interface Collection {
	id:string;
	movie_id:string;
	user_id:string;
	watched:boolean;
	watchlist:boolean;
}

export interface CollectionFilter {
	year?:string;
	cast?:string;
	vote?:string;
	genres?:string;
}

@injectable()
export class CollectionModel extends BaseModel<Collection> {

	protected keys:string[] = [ 'id', 'movie_id', 'user_id', 'watched', 'watchlist' ];
	protected lastQuery:string;

	constructor(@inject(delay(() => MysqlDatabase)) db:MysqlDatabase) {
		super(db, 'collection');
	}

	public updateCollection(data:object):Promise<any> {
		return this.database().replace(this.keys, data, [ 'watched', 'watchlist' ]).execute();
	}

	public async getCollection(user:User, type:string, page:number = 1, query:any = {}):Promise<Array<Movie>> {
		let offset = (page - 1) * PAGE_LIMIT; 
		let sql = "SELECT m.movie_id AS id, m.title, m.poster_path, m.release_date, m.runtime, m.vote_average, c.watched, c.watchlist FROM collection AS c INNER JOIN movies AS m ON c.movie_id = m.movie_id WHERE c.user_id = '"+user.id+"' AND c."+type+" = true :f";
		
		let filter = parseCollectionFilterQuery(query);
		sql = sql.replace(':f', (Object.keys(filter).length !== 0 ? ' AND ' : '') + filter.join(' AND '));

		this.lastQuery = sql;

		let order = parseCollectionOrderQuery(query);

		sql += " ORDER BY "+order+" LIMIT "+PAGE_LIMIT+" OFFSET "+offset;

		return (await this.database().query(sql)).results(Movie);
	}

	public async getTotalPages():Promise<any> {
		let total = (await this.database().query(this.lastQuery)).results().length;
		return  { pages: Math.ceil(total/PAGE_LIMIT), total: total };
	}

	public async getByIds(ids:Array<number>, user_id:string):Promise<any> {
		let ids_string = ids.join(',');
		return (await this.database().query("SELECT * FROM collection WHERE movie_id IN ("+ids_string+") AND user_id = '"+user_id+"'")).results();
	}

}