import { MysqlDatabase, MysqlResult } from '@Lib/Mysql/index';
import { Movie, MovieDetails } from '@Lib/TMDB';

export class BaseModel<M> {

	protected db:MysqlDatabase;
	protected table:string;
	protected keys:string[];

	protected primaryKey:string = 'id';

	constructor(db:MysqlDatabase, table:string) {
		this.db = db;
		this.table = table;
	}

	get query():MysqlDatabase {
		return this.database();
	}

	public async find(id:string | number):Promise<M> {
		return this.findBy(this.primaryKey, id);
	}

	public async findBy(key:string, value:string | number):Promise<M> {
		let data:M | any = (await this.database().select('*').where(key, value).execute()).single();
		return data;
	}

	public insert(data:object):Promise<MysqlResult> {
		return this.database().insert(this.keys, data).execute();
	}

	public update(object:object):Promise<MysqlResult> {
		return this.database().update(this.keys, object).where(this.primaryKey, object[this.primaryKey]).execute();
	}

	public delete(object:object):Promise<MysqlResult> {
		return this.database().delete().where(this.primaryKey, object[this.primaryKey]).execute();
	}

	public async count(conditions:Object):Promise<any> {
		return (await this.database().select('COUNT(*) AS total').whereMultiple(conditions).execute()).single();
	}

	public database():MysqlDatabase {
		return this.db.table(this.table);
	}

}