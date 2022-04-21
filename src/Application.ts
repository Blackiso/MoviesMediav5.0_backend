import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import { container } from 'tsyringe';
import { requestLogger, responseSetup, jwt } from '@Middleware/index';
import * as bodyParser from 'body-parser';
import cors from 'cors';


//Controllers
import * as controllers  from '@Controllers/index';
import { sleep } from './Helpers/index';

export class Application extends Server {

	constructor() {
        super();
        this.app.use(cors());
        this.app.use(responseSetup);
        this.app.use(requestLogger);
        this.app.use(bodyParser.json({ type: '*/*' }));
        this.app.use(jwt);
        this.app.use(bodyParser.urlencoded({extended: true})); 
    }

    get express() { return this.app; }

    public async init(callback) {

    	Logger.Info('Initializing Controllers...');

        const ctlrInstances = [];
        
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = (controllers as any)[name];
                Logger.Info('Init '+name);
                ctlrInstances.push(container.resolve(controller));
                await sleep(1000);
            }
        }
        super.addControllers(ctlrInstances);

        callback(this.app);
    }

}