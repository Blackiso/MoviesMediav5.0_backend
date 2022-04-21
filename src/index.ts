import 'module-alias/register';
import { Application } from './Application';
import * as http from 'http';
import { Logger } from '@overnightjs/logger';
import "reflect-metadata";
import { User } from '@Models/index';

declare global {
	
	namespace Express {

		interface Response {
			ok(data:any):void;
			error(data:any, code?:number):void;
		}

		interface Request {
			jwt:string | null;
			user:User;
		}
			
	}

}

const PORT = 8080;
const SERVER = new Application();
SERVER.init((express => {
	const HTTP_SERVER = http.createServer(SERVER.express);
	HTTP_SERVER.listen(PORT, () => {
		Logger.Info('Server started listening on port '+PORT);
	});
}));


