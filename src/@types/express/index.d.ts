import { User } from '@Models/index';

declare namespace Express {

	interface Response {
		ok(data:any):void;
		error(data:any, code?:number):void;
	}

	interface Request {
		jwt:string | null;
		user:User;
	}
		
}