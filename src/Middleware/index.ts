import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthenticationService } from '@Services/index';
import { JWT } from '@Lib/index';
import { User } from '@Models/index';
import { ERRORS, RequestError } from '@Config/index';

export let requestLogger = function (req:Request, res:Response, next:any) {
	Logger.Info('['+req.method+'] '+req.path);
	
	next();
}

export let responseSetup = function (req:Request, res:Response, next:any) {

	res.ok = function (data:any) {
		this.status(200).send(data);
	}
	res.error = function (error:string | Array<any> | object | RequestError, code:number = 500) {
		if (typeof error == 'string') {
			error = {
				message: error,
				code: code
			}
		}else if (error instanceof RequestError) {
			error = {
				message: error.message,
				code: error.code
			}
		}
		this.status(code).send({ errors: error});
	}
	
	next();
}

export let errorHanddler = function (err:RequestError | any, req:Request, res:Response, next:any) {
	let message = err.message || err;
	let code = 500;
	if(err instanceof RequestError) code = err.code;
	Logger.Err(message);
	return res.error(message, code);
}

export let jwt = function (req:Request, res:Response, next:any) {
	try {
		if (!req.headers.authorization) throw new RequestError(ERRORS.TOKEN_ERROR);
		let token = req.headers.authorization.replace('Bearer ', '');
		if (token.length < 10)  throw new RequestError(ERRORS.TOKEN_ERROR);

		if (/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
			req.jwt = token;
		}else {
			throw new RequestError(ERRORS.TOKEN_ERROR);
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
		if (!req.jwt) throw new RequestError(ERRORS.TOKEN_ERROR, 401);
		let jwt = new JWT(req.jwt);

		if (!jwt.verify()) throw new RequestError(ERRORS.AUTH_FAILD, 401);

		let user:User = {
			id: jwt.getBody().uid,
			username: jwt.getBody().unm,
			email: jwt.getBody().eml,
		}
		req.user = user;
		authService.setUser(user);
		next();
		
	}catch(e:any) {
		errorHanddler(e, req, res, next);
	}
}