import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthenticationService } from '@Services/index';
import { JWT } from '@Lib/index';
import { User } from '@Models/index';

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

export let errorHanddler = function (err:any, req:Request, res:Response, next:any) {
	Logger.Err(err.error || err);
	return res.error(err, err.code);
}

export let jwt = function (req:Request, res:Response, next:any) {
	try {
		if (!req.headers.authorization) throw 'No Auth Headers';
		let token = req.headers.authorization.replace('Bearer ', '');
		if (token.length < 10)  throw 'Token not found!';

		if (/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
			req.jwt = token;
		}else {
			 throw 'Invalid token!';
		}
		
	}catch(e) {
		Logger.Warn(e);
		req.jwt = null;
	}

	next();
}

export let authentication = function (req:Request, res:Response, next:any) {
	try {

		let authService = container.resolve(AuthenticationService);
		if (!req.jwt) throw 'Invalid token!';
		let jwt = new JWT(req.jwt);

		if (!jwt.verify()) throw 'Authentication error!';

		let user:User = {
			id: jwt.getBody().uid,
			username: jwt.getBody().unm,
			email: jwt.getBody().eml,
		}
		req.user = user;
		next();
		
	}catch(e) {
		errorHanddler(e, req, res, next);
	}
}