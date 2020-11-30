import { Logger } from '@overnightjs/logger';
import { Request, Response } from 'express';


export let requestLogger = function (req:Request, res:Response, next:any) {
	Logger.Imp('['+req.method+'] '+req.path);
	next();
}

export let responseSetup = function (req:Request, res:Response, next:any) {
	res.ok = function (data:any) {
		this.status(200).send(data);
	}
	res.error = function (data:string | Array<any> | object, code:number = 400) {
		if (typeof data == 'string') {
			data = {
				message: data
			}
		}
		this.status(code).send({ errors: data});
	}
	next();
}