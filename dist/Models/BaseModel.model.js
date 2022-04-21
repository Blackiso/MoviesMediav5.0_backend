"use strict";
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
exports.BaseModel = void 0;
class BaseModel {
    constructor(db, table) {
        this.primaryKey = 'id';
        this.db = db;
        this.table = table;
    }
    get query() {
        return this.database();
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findBy(this.primaryKey, id);
        });
    }
    findBy(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = (yield this.database().select('*').where(key, value).execute()).single();
            return data;
        });
    }
    insert(data) {
        return this.database().insert(this.keys, data).execute();
    }
    update(object) {
        return this.database().update(this.keys, object).where(this.primaryKey, object[this.primaryKey]).execute();
    }
    delete(object) {
        return this.database().delete().where(this.primaryKey, object[this.primaryKey]).execute();
    }
    count(conditions) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.database().select('COUNT(*) AS total').whereMultiple(conditions).execute()).single();
        });
    }
    database() {
        return this.db.table(this.table);
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.model.js.map