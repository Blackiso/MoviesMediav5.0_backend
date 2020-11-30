import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { Controller, Get, Post, Middleware } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { Validator } from '@Validator/Validator';
import { idGenerator, passwordEncrypt, passwordVerify } from '@Helpers/index';
import { JWT } from '@Lib/index';


//Models
import { UserModel } from '@Models/index';

@injectable()
@Controller('api/v5/authentication')
export class AuthenticationController {

	constructor(private validator:Validator, private userModel:UserModel) {}

	@Post('register')
	private async register(req:Request, res:Response) {

		try {
	
			let data = req.body;
			
			if (!this.validator.run('register', data)) {
				return res.error(this.validator.getErrors());
			}

			let emailCheck = await this.userModel.findBy('email', data.email);
			if (emailCheck) {
				return res.error('Email already used');
			}

			let usernameCheck = await this.userModel.findBy('username', data.username);
			if (usernameCheck) {
				return res.error('Username already used');
			}

			data.id = idGenerator();
			data.profile_image = 'default.png';
			data.password = passwordEncrypt(data.password);

			await this.userModel.insert(data);
			delete data.password;

			return res.ok(data);
		}catch(e) {
			console.log(e);
			Logger.Err(e.error || e);
			return res.error(e, e.code);
		}

	}

	@Post('login')
	private async login(req:Request, res:Response) {

		try {
	
			let data = req.body;
			let errorString = 'Wrong username or password!';
			
			if (!this.validator.run('login', data)) {
				return res.error(this.validator.getErrors());
			}

			let user = await this.userModel.findBy('username', data.username);
			if (!user) {
				return res.error(errorString);
			}

			if (!passwordVerify(data.password, user.password)) {
				return res.error(errorString);
			}

			delete user.password;
			return res.ok(user);
		}catch(e) {
			console.log(e);
			Logger.Err(e.error || e);
			return res.error(e, e.code);
		}

	}

	@Get('test')
	private test(req:Request, res:Response) {
		let response = { x: this.userModel.get() };
		return res.status(200).send(response);
	}
}