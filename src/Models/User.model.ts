import { injectable } from 'tsyringe';
import { MysqlDatabase } from '@Lib/Mysql/index';
import { BaseModel } from './BaseModel.model';
import { timePlus } from '@Helpers/index';

export interface User {
	id:string;
	username:string;
	email:string;
	password?:string;
	profile_image?:string;
	register_date?:any;
}

@injectable()
export class UserModel extends BaseModel {

	protected keys:string[] = [ 'id', 'username', 'email', 'password', 'profile_image' ];

	constructor(db:MysqlDatabase) {
		super(db, 'users');
	}

	public addTokenId(user:any, tokenId:string):Promise<any> {
		return this.db.insert(['user_id', 'token_id', 'expires'], { 
			user_id: user.id, 
			token_id: tokenId,
			expires: timePlus(10080)
		}, 'tokens').execute();
	}

	public removeTokenId(user:any, tokenId:string):Promise<any> {
		return this.db.delete('tokens')
					.where('user_id', user.id)
					.where('token_id', tokenId)
					.execute();
	}

	public getUser(id):Promise<User> {
		return this.find(id);
	}

}