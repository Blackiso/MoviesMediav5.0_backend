import 'module-alias/register';
import { ApiServer } from './ApiServer';
import * as http from 'http';
import { container } from "tsyringe";
import { Logger } from '@overnightjs/logger';
import "reflect-metadata";

declare global {
	namespace Express {
		interface Response {
			ok(data:any):void;
			error(data:any, code?:number):void;
		}
	}

	interface Array<T> {
        empty():boolean;
    }
}

Array.prototype.empty = function () {
    return this.length == 0;
}

const PORT = 8080;
const apiServer = new ApiServer();
const httpServer = http.createServer(apiServer.express);

apiServer.init();

httpServer.listen(PORT, () => {
	Logger.Info('Server started listening on port '+PORT);
});