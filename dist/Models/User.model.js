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
exports.UserModel = void 0;
const tsyringe_1 = require("tsyringe");
const index_1 = require("@Lib/index");
const BaseModel_model_1 = require("./BaseModel.model");
let UserModel = (() => {
    let UserModel = class UserModel extends BaseModel_model_1.BaseModel {
        constructor(db) {
            super(db, 'users');
            this.keys = ['id', 'username', 'email', 'password', 'profile_image'];
        }
        get() {
            this.db.select(['id', 'username'])
                .where('id', 'black')
                .where('x >', 5)
                .execute();
            return 'yay';
        }
    };
    UserModel = __decorate([
        tsyringe_1.injectable(),
        __metadata("design:paramtypes", [index_1.MysqlDatabase])
    ], UserModel);
    return UserModel;
})();
exports.UserModel = UserModel;
//# sourceMappingURL=User.model.js.map