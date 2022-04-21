"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const tsyringe_1 = require("tsyringe");
const core_1 = require("@overnightjs/core");
const Validator_1 = require("../Validator/Validator");
const index_1 = require("../Helpers/index");
const index_2 = require("../Services/index");
const index_3 = require("../Middleware/index");
const index_4 = require("../Config/index");
const index_5 = require("../Models/index");
let AuthenticationController = class AuthenticationController {
    constructor(validator, userModel, authService) {
        this.validator = validator;
        this.userModel = userModel;
        this.authService = authService;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let requestBody = req.body;
                if (!this.validator.run('register', requestBody)) {
                    return res.error(this.validator.getErrors(), 400);
                }
                let is_validEmail = yield this.userModel.findBy('email', requestBody.email);
                if (is_validEmail) {
                    throw new index_4.RequestError(index_4.ERRORS.AUTH_EMAIL_USED, 400);
                }
                let is_validUsername = yield this.userModel.findBy('username', requestBody.username);
                if (is_validUsername) {
                    throw new index_4.RequestError(index_4.ERRORS.AUTH_USERNAME_USED, 400);
                }
                requestBody.id = index_1.idGenerator();
                requestBody.profile_image = index_4.DEFAULT_IMAGE;
                requestBody.password = index_1.passwordEncrypt(requestBody.password);
                yield this.userModel.insert(requestBody);
                return res.ok(yield this.authService.authenticate(requestBody));
            }
            catch (e) {
                next(e.message);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                if (!this.validator.run('login', data)) {
                    return res.error(this.validator.getErrors(), 400);
                }
                let user = yield this.userModel.findBy('username', data.username);
                if (!user || !index_1.passwordVerify(data.password, user.password)) {
                    throw new index_4.RequestError(index_4.ERRORS.AUTH_LOGIN, 400);
                }
                return res.ok(yield this.authService.authenticate(user));
            }
            catch (e) {
                next(e.message);
            }
        });
    }
    renew(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userModel.getUser(req.user.id);
                delete user.password;
                delete user.register_date;
                return res.ok(user);
            }
            catch (e) {
                next(e.message);
            }
        });
    }
};
__decorate([
    core_1.Post('register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    core_1.Post('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "login", null);
__decorate([
    core_1.Post('token/renew'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "renew", null);
__decorate([
    core_1.Get('authenticate'),
    core_1.Middleware(index_3.authentication),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "authenticate", null);
AuthenticationController = __decorate([
    tsyringe_1.injectable(),
    core_1.Controller('api/v5/authentication'),
    core_1.ClassErrorMiddleware(index_3.errorHanddler),
    __metadata("design:paramtypes", [Validator_1.Validator,
        index_5.UserModel,
        index_2.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
