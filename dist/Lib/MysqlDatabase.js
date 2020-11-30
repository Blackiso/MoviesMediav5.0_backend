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
exports.MysqlDatabase = void 0;
const logger_1 = require("@overnightjs/logger");
const mysql = __importStar(require("mysql"));
class MysqlDatabase {
    constructor() {
        this.where_qr = [];
        this.allowedOperations = ['=', '>', '<', 'LIKE', '!='];
        this.connection = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'moviesmedia_database'
        });
        this.connection.connect((err) => {
            if (err) {
                logger_1.Logger.Err(err);
                return;
            }
            logger_1.Logger.Info('connected as id ' + this.connection.threadId);
        });
    }
    set table(name) {
        this.table_qr = name;
    }
    query($statement) {
        logger_1.Logger.Imp($statement);
    }
    execute() {
        let query = this.main_query;
        if (this.where_qr.length !== 0)
            query += ' WHERE ' + this.where_qr.join(' AND ');
        this.where_qr = [];
        this.query(query);
    }
    insert(keys, data) {
        this.main_query = 'INSERT INTO ' + this.table_qr + ' (:keys) VALUES (:values)';
        var values = [];
        keys.forEach(key => {
            values.push(mysql.escape(data[key]));
        });
        this.main_query = this.main_query.replace(':keys', keys.join(', ')).replace(':values', values.join(', '));
        return this;
    }
    update(keys, data) {
        this.main_query = 'UPDATE ' + this.table_qr + ' SET :data';
        var values = [];
        keys.forEach(key => {
            values.push(key + ' = ' + mysql.escape(data[key]));
        });
        this.main_query = this.main_query.replace(':data', values.join(', '));
        return this;
    }
    select(x) {
        this.main_query = 'SELECT ';
        if (Array.isArray(x)) {
            this.main_query += x.join(',') + ' ';
        }
        else {
            this.main_query += x + ' ';
        }
        this.main_query += 'FROM ' + this.table_qr;
        return this;
    }
    delete() {
        this.main_query = 'DELETE FROM ' + this.table_qr;
        return this;
    }
    where(key, value) {
        var _a;
        let operation = (_a = key.split(' ')[1]) !== null && _a !== void 0 ? _a : '=';
        key = key.split(' ')[0];
        if (this.allowedOperations.includes(operation)) {
            this.where_qr.push(key + operation + mysql.escape(value));
        }
        return this;
    }
}
exports.MysqlDatabase = MysqlDatabase;
//# sourceMappingURL=MysqlDatabase.js.map