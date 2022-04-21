import { ERRORS } from '@Config/index';
import { injectable, singleton } from 'tsyringe';
import { RULES, REGEX, Rule } from './validation.rules';

@singleton()
@injectable()
export class Validator {
	
	private rule:Array<Rule>;
	private fails:Array<object>;

	public run(name:string, data:any):boolean {
		try {
			this.initRule(name);
			return this.validate(data);
		}catch(e) {
			return false;
		}
	}

	private initRule(name:string):void {
		this.fails = [];
		this.rule = RULES[name];
	}

	private validate(data:any):boolean {
		this.rule.forEach(item => {
			let errors:Array<string | undefined> = [];

			if (item.required && data[item.name] === undefined) {
				errors.push(item.errors.required || ERRORS.DEFAULT_INPUT_ERROR);
			}

			if (item.reg !== undefined) {
				if (!REGEX[item.reg].test(data[item.name])) {
					errors.push(item.errors.reg || ERRORS.DEFAULT_INPUT_ERROR);
				}
			}

			if (item.type !== undefined) {
				if (!((typeof data[item.name]) === item.type)) {
					errors.push(item.errors.type || ERRORS.DEFAULT_INPUT_ERROR);
				}
			}

			if (item.length !== undefined) {
				if (data[item.name].length < item.length.min || data[item.name].length > item.length.max) {
					errors.push(item.errors.length || ERRORS.DEFAULT_INPUT_ERROR);
				}
			}

			if (errors.length !== 0) {
				let er = {};
				er[item.name] = errors;
				this.fails.push(er);
			}
		});

		return this.fails.length == 0;
	}

	public getErrors():Array<object> {
		return this.fails;
	}

}