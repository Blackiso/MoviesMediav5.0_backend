"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
    constructor(db, table) {
        this.primaryKey = 'id';
        this.db = db;
        this.table = table;
        this.db.table = table;
    }
    get query() {
        return this.db;
    }
    insert(data) {
        this.db.insert(this.keys, data).execute();
    }
    update(object) {
        this.db.update(this.keys, object).where(this.primaryKey, object[this.primaryKey]).execute();
    }
    delete(object) {
        this.db.delete().where(this.primaryKey, object[this.primaryKey]).execute();
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.model.js.map