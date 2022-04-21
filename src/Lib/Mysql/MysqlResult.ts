import * as mysql from 'mysql';

export class MysqlResult {
	
	constructor(private result:Array<any>, private fields:Array<any> | null) {}

	public single():object {
		return this.result[0] == undefined ? null : this.result[0];
	}

	public results(object:any = null):Array<any> {
		if(object) return this.result.map(x => new object(x));
		return this.result;
	}

	public count():number {
		return 0; 	
	}

}