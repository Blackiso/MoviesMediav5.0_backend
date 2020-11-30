import * as mysql from 'mysql';

export class MysqlResult {
	
	constructor(private result:Array<any>, private fields:Array<any> | null) {}

	public single():object {
		return this.result[0] == undefined ? null : this.result[0];
	}

	public count():number {
		return 0; 	
	}

}