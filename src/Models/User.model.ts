import { injectable } from 'tsyringe';
import { MysqlDatabase } from '@Lib/index';
import { BaseModel } from './BaseModel.model';


@injectable()
export class UserModel extends BaseModel {

	protected keys:string[] = [ 'id', 'username', 'email', 'password', 'profile_image' ];

	constructor(db:MysqlDatabase) {
		super(db, 'users');
	}

	public get() {
		this.db.select(['id', 'username'])
				.where('id', 'black')
				.where('x >', 5)
				.execute();
		return 'yay';
	}
}