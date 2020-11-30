import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export let idGenerator = function ():string {
	return uuidv4();
}

export let passwordEncrypt = function (password:string):string {
	return bcrypt.hashSync(password, saltRounds);
}

export let passwordVerify = function (password:string, hash:string):boolean {
	return bcrypt.compareSync(password, hash);
}