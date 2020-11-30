import { Database } from '@Interfaces/Database.interface';
import { MysqlResult } from './MysqlResult';
import { Logger } from '@overnightjs/logger';
import * as mysql from 'mysql';

export class MysqlDatabase implements Database {
	
	private table_qr:string;
	private where_qr:string[] = [];
	private main_query:string;
	private connection:any;

	private allowedOperations = ['=', '>', '<', 'LIKE', '!='];

	constructor() {
		this.connection = mysql.createConnection({
			host     : '127.0.0.1',
			user     : 'root',
			password : 'root',
			database : 'moviesmedia_database'
		});

		this.connection.connect((err) => {
			if (err) {
				Logger.Err(err);
				return;
			}

			Logger.Info('connected as id ' + this.connection.threadId);
		});
	}

	set table(name) {
		this.table_qr = name;
	}

	private query(statement):Promise<MysqlResult> {
		Logger.Imp(statement);
		
		return new Promise((res, rej) => {
			this.connection.query(statement, (err, result, fields) => {
				if (err) rej(err);
				res(new MysqlResult(result, fields));
			});
		});
	}

	public execute():Promise<MysqlResult> {
		let query = this.main_query;
		if (this.where_qr.length !== 0) query += ' WHERE ' + this.where_qr.join(' AND ');
		this.where_qr = [];
		return this.query(query);
	}

	public insert(keys:string[], data:object):MysqlDatabase {
		this.main_query = 'INSERT INTO '+this.table_qr+' (:keys) VALUES (:values)';
		var values:string[] = [];
		keys.forEach(key => {
			values.push(mysql.escape(data[key]));
		});

		this.main_query = this.main_query.replace(':keys', keys.join(', ')).replace(':values', values.join(', '));
		return this;
	}

	public update(keys:string[], data:object):MysqlDatabase {
		this.main_query = 'UPDATE '+this.table_qr+' SET :data';
		var values:string[] = [];
		keys.forEach(key => {
			values.push(key+' = '+mysql.escape(data[key]));
		});

		this.main_query = this.main_query.replace(':data', values.join(', '));
		return this;
	}

	public select(x:string[] | string):MysqlDatabase {
		this.main_query = 'SELECT ';
		if (Array.isArray(x)) {
			this.main_query += x.join(',') + ' ';
		}else {
			this.main_query += x + ' ';
		}
		this.main_query += 'FROM ' + this.table_qr;
		return this;
	}

	public delete():MysqlDatabase {
		this.main_query = 'DELETE FROM '+ this.table_qr;
		return this;
	}

	public where(key:string, value:string | number):MysqlDatabase {
		let operation = key.split(' ')[1] ?? '=';
		key = key.split(' ')[0];
		if (this.allowedOperations.includes(operation)) {
			this.where_qr.push(key+operation+mysql.escape(value));
		}
		return this;
	}

}