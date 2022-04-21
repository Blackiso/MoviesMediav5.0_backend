import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware, ClassErrorMiddleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Validator } from '@Validator/Validator';
import { idGenerator, passwordEncrypt, passwordVerify } from '@Helpers/index';
import { AuthenticationService } from '@Services/index';
import { errorHanddler, authentication } from '@Middleware/index';
import { ERRORS, DEFAULT_IMAGE, RequestError } from '@Config/index';

//Models
import { UserModel } from '@Models/index';

@injectable()
@Controller('api/v5/authentication')
@ClassErrorMiddleware(errorHanddler)
export class AuthenticationController {

	constructor(
		private validator:Validator, 
		private userModel:UserModel,
		private authService:AuthenticationService
	) {}

	@Post('register')
	private async register(req:Request, res:Response, next:any) {
		try {

			let requestBody = req.body;
		
			if (!this.validator.run('register', requestBody)) {
				return res.error(this.validator.getErrors(), 400);
			}

			let is_validEmail = await this.userModel.findBy('email', requestBody.email);
			if (is_validEmail) {
				throw new RequestError(ERRORS.AUTH_EMAIL_USED, 400);
			}

			let is_validUsername = await this.userModel.findBy('username', requestBody.username);
			if (is_validUsername) {
				throw new RequestError(ERRORS.AUTH_USERNAME_USED, 400);
			}

			requestBody.id = idGenerator();
			requestBody.profile_image = DEFAULT_IMAGE;
			requestBody.password = passwordEncrypt(requestBody.password);

			await this.userModel.insert(requestBody);
			return res.ok(await this.authService.authenticate(requestBody));

		}catch(e:any) {
			next(e.message);
		}
	}

	@Post('login')
	private async login(req:Request, res:Response, next:any) {

		try {
	
			let data = req.body;
			
			if (!this.validator.run('login', data)) {
				return res.error(this.validator.getErrors(), 400);
			}

			let user = await this.userModel.findBy('username', data.username);
			if (!user || !passwordVerify(data.password, user.password)) {
				throw new RequestError(ERRORS.AUTH_LOGIN, 400);
			}

			return res.ok(await this.authService.authenticate(user));

		}catch(e:any) {
			next(e.message);
		}

	}

	@Post('token/renew')
	private async renew(req:Request, res:Response) {

	}

	@Get('authenticate')
	@Middleware(authentication)
	private async authenticate(req:Request, res:Response, next:any) {

		try {
			
			let user = await this.userModel.getUser(req.user.id);
			delete user.password;
			delete user.register_date;
			return res.ok(user);

		}catch(e:any) {
			next(e.message);
		}
		
	}


}