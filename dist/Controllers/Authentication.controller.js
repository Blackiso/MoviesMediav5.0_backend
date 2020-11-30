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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const tsyringe_1 = require("tsyringe");
const index_1 = require("@Interfaces/index");
const core_1 = require("@overnightjs/core");
const logger_1 = require("@overnightjs/logger");
const index_2 = require("@Models/index");
let AuthenticationController = (() => {
    var _a, _b;
    let AuthenticationController = class AuthenticationController {
        constructor(userModel) {
            this.userModel = userModel;
        }
        register(req, res) {
            try {
                let data = req.body;
                data.id = 'xxxxxxxxxxx';
                this.userModel.insert(req.body);
                this.userModel.update(data);
                this.userModel.delete(data);
                return res.ok(data);
            }
            catch (e) {
                console.log(e);
                logger_1.Logger.Err(e.error || e);
                return res.error(e, e.code);
            }
        }
        test(req, res) {
            let response = { x: this.userModel.get() };
            return res.status(200).send(response);
        }
    };
    __decorate([
        core_1.Post('register'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, typeof (_a = typeof index_1.APIResponse !== "undefined" && index_1.APIResponse) === "function" ? _a : Object]),
        __metadata("design:returntype", void 0)
    ], AuthenticationController.prototype, "register", null);
    __decorate([
        core_1.Get('test'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, typeof (_b = typeof index_1.APIResponse !== "undefined" && index_1.APIResponse) === "function" ? _b : Object]),
        __metadata("design:returntype", void 0)
    ], AuthenticationController.prototype, "test", null);
    AuthenticationController = __decorate([
        tsyringe_1.injectable(),
        core_1.Controller('api/v5/authentication'),
        __metadata("design:paramtypes", [index_2.UserModel])
    ], AuthenticationController);
    return AuthenticationController;
})();
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=Authentication.controller.js.map