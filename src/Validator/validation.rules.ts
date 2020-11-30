export interface Rule {
	name:string;
	required:boolean;
	length?:{
		max:number,
		min:number
	};
	type?:string,
	errors:{
		required?:string,
		length?:string,
		type?:string
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
			type: 'aZ09-_',
			errors: {
				required: 'Username is required!',
				length: 'Username length should be max 20 min 5.',
				type: 'Invalid username use alphabets, numbers, dash and underscore only.'
			} 
		},
		{
			name: 'password',
			required: true,
			length: {
				max: 50,
				min: 5
			},
			errors: {
				required: 'Password is required!',
				length: 'Password length should be max 50 min 5.'
			}
		},
		{
			name: 'email',
			required: true,
			type: 'email',
			errors: {
				required: 'Email is required!',
				type: 'Invalid email, please enter a valid email.'
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
	]

}

export let TYPES = {
	'aZ09-_': /^[a-zA-Z0-9-_]+$/,
	'email': /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
}