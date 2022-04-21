import { singleton } from 'tsyringe';
import { MysqlResult } from './MysqlResult';
import { Logger } from '@overnightjs/logger';
import * as mysql from 'mysql';
import { MYSQL } from '@Config/index';

@singleton()
export class MysqlDatabase {
	
	private table_qr:string;
	private where_qr:string[] = [];
	private main_query:string;
	private connection:any;

	private reconnect_attemts:number = 0;
	private max_reconnect_attemts:number = 5;
	private reconnect_interval:number = 15000;

	private allowedOperations = ['=', '>', '<', 'LIKE', '!='];

	constructor() {
		this.connection = mysql.createPool({
			connectionLimit : 2,
			host            : MYSQL.host,
			user            : MYSQL.user,
			password        : MYSQL.password,
			database        : MYSQL.database
		});

		this.connection.on('error', this.handleErrors.bind(this));
	}

	private handleErrors(err) {
		console.log(err.code);
	}

	public table(name):MysqlDatabase {
		this.table_qr = name;
		return this;
	}

	public query(statement):Promise<MysqlResult> {
		Logger.Imp(statement);
		
		return new Promise((res, rej) => {
			this.connection.query(statement, (err, result, fields) => {
				if (err) {
					rej(err);
				}
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

	public insert(keys:string[], data:object, table?:string):MysqlDatabase {
		table = table ? table : this.table_qr;
		this.main_query = 'INSERT INTO '+table+' (:keys) VALUES (:values)';
		var values:string[] = [];
		keys.forEach(key => {
			values.push(mysql.escape(data[key]));
		});

		this.main_query = this.main_query.replace(':keys', keys.join(', ')).replace(':values', values.join(', '));
		return this;
	}

	public update(keys:string[], data:object, table?:string):MysqlDatabase {
		table = table ? table : this.table_qr;
		this.main_query = 'UPDATE '+table+' SET :data';
		var values:string[] = [];
		keys.forEach(key => {
			values.push(key+' = '+mysql.escape(data[key]));
		});

		this.main_query = this.main_query.replace(':data', values.join(', '));
		return this;
	}

	public select(x:string[] | string, table?:string):MysqlDatabase {
		table = table ? table : this.table_qr;
		this.main_query = 'SELECT ';
		if (Array.isArray(x)) {
			this.main_query += x.join(',') + ' ';
		}else {
			this.main_query += x + ' ';
		}
		this.main_query += 'FROM ' + table;
		return this;
	}

	public delete(table?:string):MysqlDatabase {
		table = table ? table : this.table_qr;
		this.main_query = 'DELETE FROM '+ table;
		return this;
	}

	public replace(keys:string[], data:object, to_update:string[], table?:string):MysqlDatabase {
		table = table || this.table_qr;
		this.insert(keys, data, table);

		this.main_query += ' ON DUPLICATE KEY UPDATE ';
		let update:string[] = [];

		to_update.forEach(item => {
			let value = item +" = ";
			if(typeof data[item] === 'string') {
				value += "'"+data[item]+"'";
			}else {
				value += data[item];
			}
			update.push(value);
		});

		this.main_query += update.join(', ');

		return this;
	}

	public whereMultiple(conditions:Object):MysqlDatabase {
		for (let key in conditions) {
			this.where(key, conditions[key]);
		}
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