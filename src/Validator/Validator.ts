import { injectable, singleton } from 'tsyringe';
import { RULES, TYPES, Rule } from './validation.rules';

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

			if (item.required && !data[item.name]) {
				errors.push(item.errors.required);
			}

			if (item.type) {
				if (!TYPES[item.type].test(data[item.name])) {
					errors.push(item.errors.type);
				}
			}

			if (item.length) {
				if (data[item.name].length < item.length.min || data[item.name].length > item.length.max) {
					errors.push(item.errors.length);
				}
			}

			if (!errors.empty()) {
				this.fails.push({ name: item.name, errors: errors });
			}
		});

		return this.fails.empty();
	}

	public getErrors():Array<object> {
		return this.fails;
	}

}