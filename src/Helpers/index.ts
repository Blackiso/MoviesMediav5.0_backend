import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { COLLECTION_FILTER, COLLECTION_ORDER, FILTER } from '@Config/index';
import { TMDB } from '@Lib/TMDB';

const saltRounds = 10;

export let idGenerator = function (): string {
	return uuidv4();
}

export let randomeId = function (): string {
	let ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
	let ID_LENGTH = 20;
	let rtn = '';

	for (let i = 0; i < ID_LENGTH; i++) {
		rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
	}
	return rtn;
}

export let timePlus = function (minutes) {
	let date = new Date();
	return new Date(date.getTime() + minutes * 60000).getTime();
}

export let passwordEncrypt = function (password: string): string {
	return bcrypt.hashSync(password, saltRounds);
}

export let passwordVerify = function (password: string, hash: string | undefined): boolean {
	return bcrypt.compareSync(password, hash);
}

export let sleep = function (ms): Promise<any> {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

export let inArrayOfObjects = function (array: Array<any>, key: string, value: any): any {
	for (let i = 0; i < array.length; i++) {
		if (array[i][key] === value) return array[i];
	}

	return null;
}

export let parseFilterQuery = async function (query:any, tmdb:TMDB) {
	let _query = {} as any;

	for (let key in FILTER) {
		if (key in query) {
			_query[FILTER[key]] = query[key];
		}
	}

	if ('with_cast' in _query) {
		let cast = await tmdb.people(_query.with_cast);
		_query.with_cast = cast?.[0].id;
	}

	return _query;
}

export let parseCollectionFilterQuery = function(query:any):Array<string> {
	console.log(query);
	let _query:Array<string> = [];
	for(let key in query) {
		if(key in COLLECTION_FILTER) _query.push(COLLECTION_FILTER[key](query[key]));
	}
	return _query;
}

export let parseCollectionOrderQuery = function(query:any):string {
	let order = COLLECTION_ORDER.NF;
	if ('order' in query && query.order in COLLECTION_ORDER) {
		order = COLLECTION_ORDER[query.order];
	}
	return order;
}