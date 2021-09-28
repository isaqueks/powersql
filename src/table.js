"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PowerSQLTableColumn = exports.PowerSQLTable = void 0;
class PowerSQLTableColumn {
    constructor(Name, Type, Attributes = []) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid column name! ${Name} received.`);
        }
        if (typeof Type != 'string' || !Type) {
            throw new Error(`Expected a valid type! ${Type} received.`);
        }
        this._name = Name;
        this._type = Type;
        this._attributes = Attributes;
    }
    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get attributes() {
        return this._attributes;
    }
}
exports.PowerSQLTableColumn = PowerSQLTableColumn;
class PowerSQLTable {
    constructor(Name, Columns) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid table name! ${Name} received.`);
        }
        if (!Columns || Columns.length <= 0) {
            throw new Error('At least 1 column expected!');
        }
        this._name = Name;
        this._columns = Columns;
    }
    get name() {
        return this._name;
    }
    get columns() {
        return this._columns;
    }
    getColumn(columnName) {
        if (columnName == undefined) {
            throw new Error('columnName expected! undefined received.');
        }
        for (let column of this._columns) {
            if (column.name === columnName) {
                return column;
            }
        }
        return null;
    }
    hasColumn(columnName, type = undefined) {
        const col = this.getColumn(columnName);
        if (col && (type === undefined || col.type == type)) {
            return true;
        }
        return false;
    }
}
exports.PowerSQLTable = PowerSQLTable;
