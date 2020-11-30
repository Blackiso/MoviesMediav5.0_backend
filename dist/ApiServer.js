"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = void 0;
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const tsyringe_1 = require("tsyringe");
const Middleware_1 = require("./Middleware");
const bodyParser = __importStar(require("body-parser"));
const controllers = __importStar(require("@Controllers/index"));
class ApiServer extends core_1.Server {
    constructor() {
        super();
        this.app.use(Middleware_1.responseSetup);
        this.app.use(Middleware_1.requestLogger);
        this.app.use(bodyParser.json({ type: '*/*' }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }
    get express() { return this.app; }
    init() {
        logger_1.Logger.Info('Initializing Controllers...');
        const ctlrInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                const controller = controllers[name];
                logger_1.Logger.Info('Init ' + name);
                ctlrInstances.push(tsyringe_1.container.resolve(controller));
            }
        }
        super.addControllers(ctlrInstances);
    }
}
exports.ApiServer = ApiServer;
//# sourceMappingURL=ApiServer.js.map