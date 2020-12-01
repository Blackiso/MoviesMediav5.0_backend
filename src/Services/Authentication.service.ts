import { injectable, singleton } from 'tsyringe';
import { UserModel } from '@Models/index';
import { JWT } from '@Lib/index';
import { randomeId, timePlus } from '@Helpers/index';

@singleton()
@injectable()
export class AuthenticationService {
	
	constructor(private userModel:UserModel) {}

	public async authenticate(user:any):Promise<any> {
		let jwt = new JWT();
		let exp = timePlus(15);
		let tokenId = randomeId();
		let body = {
			uid: user.id,
			eml: user.email,
			unm: user.username,
			jti: tokenId,
			exp: exp
		}

		await this.userModel.addTokenId(user, tokenId);

		return {
			token: jwt.generate(body),
			expiration: exp,
			tokenId: tokenId
		}
	}

	public revokeToken(userId:string, tokenId:string):void {
		this.userModel.removeTokenId(userId, tokenId);
	}

}