import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { requestLogger, responseSetup } from './Middleware';
import * as bodyParser from 'body-parser';

//Controllers
import * as controllers  from '@Controllers/index';

export class ApiServer extends Server {

	constructor() {
        super();
        this.app.use(responseSetup);
        this.app.use(requestLogger);
        this.app.use(bodyParser.json({ type: '*/*' }));
        this.app.use(bodyParser.urlencoded({extended: true}));
    }

    get express() { return this.app; }

    public init() {
    	Logger.Info('Initializing Controllers...');

    	const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                Logger.Info('Init '+name);
                ctlrInstances.push(container.resolve(controller));
            }
        }
        super.addControllers(ctlrInstances);
    }

}