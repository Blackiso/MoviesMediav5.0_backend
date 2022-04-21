export interface Rule {
	name:string;
	required:boolean;
	length?:{
		max:number,
		min:number
	};
	reg?:string,
	type?:string,
	errors:{
		required?:string,
		length?:string,
		type?:string,
		reg?:string
	}
}

export let RULES = {

	register: [
		{
			name: 'username',
			required: true,
			length: {
				max: 20,
				min: 5
			},
			reg: 'aZ09-_',
			errors: {
				required: 'Username is required!',
				length: 'Username length should be max 20 min 5.',
				reg: 'Invalid username use alphabets, numbers, dash and underscore only.'
			} 
		},
		{
			name: 'password',
			required: true,
			length: {
				max: 50,
				min: 5
			},
			type: 'string',
			errors: {
				required: 'Password is required!',
				length: 'Password length should be max 50 min 5.'
			}
		},
		{
			name: 'email',
			required: true,
			reg: 'email',
			errors: {
				required: 'Email is required!',
				reg: 'Invalid email, please enter a valid email.'
			}
		}
	],
	login: [
		{
			name: 'username',
			required: true,
			errors: {
				required: 'Username is required!'
			}
		},
		{
			name: 'password',
			required: true,
			errors: {
				required: 'Password is required!'
			}
		}
	],
	collection_add: [
		{
			name: 'id',
			required: true,
			type: 'number',
			errors: {
				required: 'ID is required!'
			}
		},
		{
			name: 'watched',
			required: true,
			type: 'boolean',
			errors: {
				required: 'watched feild is required!',
				type: 'invalid type!'
			}
		},
		{
			name: 'watchlist',
			required: true,
			type: 'boolean',
			errors: {
				required: 'watchlist feild is required!',
				type: 'invalid type!'
			}
		}
	]

}

export let REGEX = {
	'aZ09-_': /^[a-zA-Z0-9-_]+$/,
	'email': /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
}