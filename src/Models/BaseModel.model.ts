import { MysqlDatabase, MysqlResult } from '@Lib/Mysql/index';

export class BaseModel {

	protected db:MysqlDatabase;
	protected table:string;
	protected keys:string[];

	private primaryKey:string = 'id';

	constructor(db:MysqlDatabase, table:string) {
		this.db = db;
		this.table = table;
		this.db.table = table;
	}

	get query():MysqlDatabase {
		return this.db;
	}

	public async find(id:string | number):Promise<any> {
		return (await this.db.select('*').where(this.primaryKey, id).execute()).single();
	}

	public async findBy(key:string, value:string | number):Promise<any> {
		return (await this.db.select('*').where(key, value).execute()).single();
	}

	public insert(data:object):Promise<any> {
		return this.db.insert(this.keys, data).execute();
	}

	public update(object:object):Promise<any> {
		return this.db.update(this.keys, object).where(this.primaryKey, object[this.primaryKey]).execute();
	}

	public delete(object:object):Promise<any> {
		return this.db.delete().where(this.primaryKey, object[this.primaryKey]).execute();
	}

}