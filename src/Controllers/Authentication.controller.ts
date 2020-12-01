import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware, ClassErrorMiddleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Validator } from '@Validator/Validator';
import { idGenerator, passwordEncrypt, passwordVerify } from '@Helpers/index';
import { AuthenticationService } from '@Services/index';
import { errorHanddler, authentication } from '@Middleware/index';

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

			let data = req.body;
		
			if (!this.validator.run('register', data)) {
				return res.error(this.validator.getErrors());
			}

			let emailCheck = await this.userModel.findBy('email', data.email);
			if (emailCheck) {
				throw 'Email already used';
			}

			let usernameCheck = await this.userModel.findBy('username', data.username);
			if (usernameCheck) {
				throw 'Username already used';
			}

			data.id = idGenerator();
			data.profile_image = 'default.png';
			data.password = passwordEncrypt(data.password);

			await this.userModel.insert(data);
			return res.ok(await this.authService.authenticate(data));

		}catch(e) {
			next(e);
		}
	}

	@Post('login')
	private async login(req:Request, res:Response, next:any) {

		try {
	
			let data = req.body;
			let errorString = 'Wrong username or password!';
			
			if (!this.validator.run('login', data)) {
				return res.error(this.validator.getErrors());
			}

			let user = await this.userModel.findBy('username', data.username);
			if (!user || !passwordVerify(data.password, user.password)) {
				throw errorString;
			}

			return res.ok(await this.authService.authenticate(user));

		}catch(e) {
			next(e);
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

		}catch(e) {
			next(e);
		}
	}


}