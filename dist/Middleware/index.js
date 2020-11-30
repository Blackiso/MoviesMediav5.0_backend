"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseSetup = exports.requestLogger = void 0;
const logger_1 = require("@overnightjs/logger");
exports.requestLogger = function (req, res, next) {
    logger_1.Logger.Imp('[' + req.method + '] ' + req.path);
    next();
};
exports.responseSetup = function (req, res, next) {
    res.ok = function (data) {
        this.status(200).send(data);
    };
    res.error = function (data, code = 400) {
        this.status(code).send(data);
    };
    next();
};
//# sourceMappingURL=index.js.map