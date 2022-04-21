import * as crypto from 'crypto';
import { Logger } from '@overnightjs/logger';

export class JWT {

	private alg:string = 'sha256';
	private typ:string = 'JWT';
	private secret:string = 'p=x,?5Ighr7C~Py';

	private token:string;
	private header:any = null;
	private body:any = null;

	constructor(token?:string) {
		if (token) {
			this.token = token;
		}
	}

	public getBody() {
		return this.body;
	}

	public verify():boolean {
		let parts = this.token.split('.');
		let signiture = parts[2];
		parts.pop();

		this.body = this.fromBase64(parts[1]);
		this.header = this.fromBase64(parts[0]);

		if (this.header.alg !== this.alg) {
			Logger.Warn('Invalid algorithim!');
			return false;
		}

		if (this.hash(parts.join('.')) !== signiture) {
			Logger.Warn('Invalid signiture!');
			return false;
		}

		let currentTime = new Date().getTime();
		if (this.body.exp < currentTime) {
			Logger.Warn('Token expired!');
			// return false;
		}

		return true;
	} 

	public generate(body:object) {
		let header = {
			alg: this.alg,
			typ: this.typ
		}
		let token = this.toBase64(header)+'.'+this.toBase64(body);
		return token+'.'+this.hash(token);
	}

	private toBase64(obj:object):string {
		return Buffer.from(JSON.stringify(obj)).toString('base64');
	}

	private fromBase64(base:string):object {
		return JSON.parse(Buffer.from(base, 'base64').toString('ascii'));
	}

	private hash(key:string):string {
		let hmac = crypto.createHmac(this.alg, this.secret);
		hmac.write(key);
		hmac.end();
		return hmac.read().toString('hex');
	}

}