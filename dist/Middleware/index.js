"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = exports.jwt = exports.errorHanddler = exports.responseSetup = exports.requestLogger = void 0;
const logger_1 = require("@overnightjs/logger");
const tsyringe_1 = require("tsyringe");
const index_1 = require("../Services/index");
const index_2 = require("../Lib/index");
const index_3 = require("../Config/index");
let requestLogger = function (req, res, next) {
    logger_1.Logger.Info('[' + req.method + '] ' + req.path);
    next();
};
exports.requestLogger = requestLogger;
let responseSetup = function (req, res, next) {
    res.ok = function (data) {
        this.status(200).send(data);
    };
    res.error = function (error, code = 500) {
        if (typeof error == 'string') {
            error = {
                message: error,
                code: code
            };
        }
        else if (error instanceof index_3.RequestError) {
            error = {
                message: error.message,
                code: error.code
            };
        }
        this.status(code).send({ errors: error });
    };
    next();
};
exports.responseSetup = responseSetup;
let errorHanddler = function (err, req, res, next) {
    let message = err.message || err;
    let code = 500;
    if (err instanceof index_3.RequestError)
        code = err.code;
    logger_1.Logger.Err(message);
    return res.error(message, code);
};
exports.errorHanddler = errorHanddler;
let jwt = function (req, res, next) {
    try {
        if (!req.headers.authorization)
            throw new index_3.RequestError(index_3.ERRORS.TOKEN_ERROR);
        let token = req.headers.authorization.replace('Bearer ', '');
        if (token.length < 10)
            throw new index_3.RequestError(index_3.ERRORS.TOKEN_ERROR);
        if (/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token)) {
            req.jwt = token;
        }
        else {
            throw new index_3.RequestError(index_3.ERRORS.TOKEN_ERROR);
        }
    }
    catch (e) {
        logger_1.Logger.Warn(e);
        req.jwt = null;
    }
    next();
};
exports.jwt = jwt;
let authentication = function (req, res, next) {
    try {
        let authService = tsyringe_1.container.resolve(index_1.AuthenticationService);
        if (!req.jwt)
            throw new index_3.RequestError(index_3.ERRORS.TOKEN_ERROR, 401);
        let jwt = new index_2.JWT(req.jwt);
        if (!jwt.verify())
            throw new index_3.RequestError(index_3.ERRORS.AUTH_FAILD, 401);
        let user = {
            id: jwt.getBody().uid,
            username: jwt.getBody().unm,
            email: jwt.getBody().eml,
        };
        req.user = user;
        authService.setUser(user);
        next();
    }
    catch (e) {
        (0, exports.errorHanddler)(e, req, res, next);
    }
};
exports.authentication = authentication;
//# sourceMappingURL=index.js.map