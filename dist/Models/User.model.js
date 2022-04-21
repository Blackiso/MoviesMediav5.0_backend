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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const tsyringe_1 = require("tsyringe");
const index_1 = require("../Lib/Mysql/index");
const BaseModel_model_1 = require("./BaseModel.model");
const index_2 = require("../Helpers/index");
let UserModel = class UserModel extends BaseModel_model_1.BaseModel {
    constructor(db) {
        super(db, 'users');
        this.keys = ['id', 'username', 'email', 'password', 'profile_image'];
    }
    addTokenId(user, tokenId) {
        return this.db.insert(['user_id', 'token_id', 'expires'], {
            user_id: user.id,
            token_id: tokenId,
            expires: (0, index_2.timePlus)(10080)
        }, 'tokens').execute();
    }
    removeTokenId(user, tokenId) {
        return this.db.delete('tokens')
            .where('user_id', user.id)
            .where('token_id', tokenId)
            .execute();
    }
    getUser(id) {
        return this.find(id);
    }
};
UserModel = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)((0, tsyringe_1.delay)(() => index_1.MysqlDatabase))),
    __metadata("design:paramtypes", [index_1.MysqlDatabase])
], UserModel);
exports.UserModel = UserModel;
//# sourceMappingURL=User.model.js.map