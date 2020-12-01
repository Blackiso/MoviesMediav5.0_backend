import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

const saltRounds = 10;

export let idGenerator = function ():string {
	return uuidv4();
}

export let randomeId = function ():string {
	let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
	let ID_LENGTH = 20;
  	let rtn = '';

	for (let i = 0; i < ID_LENGTH; i++) {
		rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
	}
	return rtn;
}

export let timePlus =  function (minutes) {
	let date = new Date();
    return new Date(date.getTime() + minutes*60000).getTime();
}

export let passwordEncrypt = function (password:string):string {
	return bcrypt.hashSync(password, saltRounds);
}

export let passwordVerify = function (password:string, hash:string):boolean {
	return bcrypt.compareSync(password, hash);
}