"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unifyStatements(statements, join = ' ') {
    const sqls = [];
    const params = [];
    for (const cond of statements) {
        if (typeof cond === 'string') {
            sqls.push(cond);
        }
        else if (typeof cond === 'object' && Array.isArray(cond) && cond.length === 2) {
            const condAsResult = cond;
            sqls.push(condAsResult[0].trim());
            params.push(...condAsResult[1]);
        }
        else {
            throw new Error(`Unknown statement: ${cond}.`);
        }
    }
    return [`${sqls.join(join)}`, params];
}
class PowerSQLDefaults {
    static select(...items) {
        return [`SELECT ${items.join(', ')}`];
    }
    static selectWhere(table, values) {
        const conditions = [];
        const params = [];
        for (const column in values) {
            if (!table.hasColumn(column)) {
                continue;
            }
            conditions.push(`${column} = ?`);
            params.push(values[column]);
        }
        return [`SELECT * FROM ${table.name} WHERE (${conditions.join(' AND ')})`, params];
    }
    static from(table) {
        return [`FROM ${table.name}`];
    }
    static where(...conditions) {
        const [sql, params] = unifyStatements(conditions, ' ');
        return [`WHERE ${sql}`, params];
    }
    static createTable(table, sqlliteIfNotExists = false) {
        const tableColumns = [];
        for (const column of table.columns) {
            tableColumns.push(`${column.name} ${column.type} ${column.attributes.join(' ')}`);
        }
        return [`CREATE TABLE${sqlliteIfNotExists ? ' IF NOT EXISTS' : ''} ${table.name} (${tableColumns.join(', ').trim()})`];
    }
    static insertInto(table, values) {
        const params = [];
        const tableColumns = [];
        for (const columnName in values) {
            if (!table.hasColumn(columnName)) {
                continue;
            }
            tableColumns.push(columnName);
            params.push(values[columnName]);
        }
        return [`INSERT INTO ${table.name} (${tableColumns.join(', ')}) VALUES (${tableColumns.map(x => '?').join(', ')})`, params];
    }
    static delete() {
        return ['DELETE'];
    }
    static update(table) {
        return [`UPDATE ${table.name}`];
    }
    static set(values) {
        const setStatements = [];
        const params = [];
        for (const columnName in values) {
            setStatements.push(`${columnName} = ?`);
            params.push(values[columnName]);
        }
        return [`SET ${setStatements.join(', ')}`, params];
    }
    static group(...statements) {
        const [sql, params] = unifyStatements(statements);
        return [`(${sql})`, params];
    }
    // Compare methods
    static equal(a, b) {
        return [`${a} = ?`, [b]];
    }
    static notEqual(a, b) {
        return [`${a} <> ?`, [b]];
    }
    static higher(a, b) {
        return [`${a} > ?`, [b]];
    }
    static lower(a, b) {
        return [`${a} < ?`, [b]];
    }
    static higherEqual(a, b) {
        return [`${a} >= ?`, [b]];
    }
    static lowerEqual(a, b) {
        return [`${a} <= ?`, [b]];
    }
    static like(a, b) {
        return [`${a} LIKE ?`, [b]];
    }
    // AND / OR
    static and(...statements) {
        const [sql, params] = unifyStatements(statements);
        return [`AND (${sql})`, params];
    }
    static or(...statements) {
        const [sql, params] = unifyStatements(statements);
        return [`OR (${sql})`, params];
    }
}
;
exports.default = PowerSQLDefaults;
