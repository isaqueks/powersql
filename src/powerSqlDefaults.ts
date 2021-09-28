import { PowerSQLTable } from '..';
import PowerSQLStatementResult, { MultipleStatements, Param, SQL } from './powerSqlStatementResult'


interface PowerSQLDefaultsContainer {
    [fn: string]: (...any) => PowerSQLStatementResult;
}

function unifyStatements(statements: MultipleStatements, join: string = ' '): PowerSQLStatementResult {
    const sqls: SQL[] = [];
    const params: Param[] = [];

    for (const cond of statements) {
        if (typeof cond === 'string') {
            sqls.push(cond);
        }
        else if (typeof cond === 'object' && Array.isArray(cond) && cond.length === 2) {
            const condAsResult = cond as PowerSQLStatementResult;
            sqls.push(condAsResult[0].trim());
            params.push(...condAsResult[1]);
        }
        else {
            throw new Error(`Unknown statement: ${cond}.`);
        }
    }
   
    return [`${sqls.join(join)}`, params];
}


class PowerSQLDefaults implements PowerSQLDefaultsContainer {
    [fn: string]: (...any: any[]) => PowerSQLStatementResult;

    static select(...items: string[]): PowerSQLStatementResult {
        return [`SELECT ${items.join(', ')}`];
    }

    static selectWhere(table: PowerSQLTable, values: { [column: string]: any }): PowerSQLStatementResult {
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

    static from(table: PowerSQLTable): PowerSQLStatementResult {
        return [`FROM ${table.name}`];
    }

    static where(...conditions: MultipleStatements): PowerSQLStatementResult {
        const [sql, params] = unifyStatements(conditions, ' ');
        return [`WHERE ${sql}`, params];

    }

    static createTable(table: PowerSQLTable, sqlliteIfNotExists: boolean = false): PowerSQLStatementResult {
        const tableColumns = [];
        for (const column of table.columns) {
            tableColumns.push(`${column.name} ${column.type} ${column.attributes.join(' ')}`);
        }
        return [`CREATE TABLE${sqlliteIfNotExists ? ' IF NOT EXISTS' : ''} ${table.name} (${tableColumns.join(', ').trim()})`];
    }

    static insertInto(table: PowerSQLTable, values: { [column: string]: any }): PowerSQLStatementResult {

        const params: Param[] = [];
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

    static delete(): PowerSQLStatementResult {
        return ['DELETE'];
    }

    static update(table: PowerSQLTable): PowerSQLStatementResult {
        return [`UPDATE ${table.name}`];
    }

    static set(values: { [column: string]: any }): PowerSQLStatementResult {
        const setStatements: SQL[] = [];
        const params: Param[] = [];

        for (const columnName in values) {
            setStatements.push(`${columnName} = ?`);
            params.push(values[columnName]);
        }

        return [`SET ${setStatements.join(', ')}`, params];
    }

    static group(...statements: MultipleStatements): PowerSQLStatementResult {
        const [sql, params] = unifyStatements(statements);
        return [`(${sql})`, params];
    }


    // Compare methods
    static equal(a: any, b: any): PowerSQLStatementResult {
        return [`${a} = ?`, [b]];
    }

    static notEqual(a: any, b: any): PowerSQLStatementResult {
        return [`${a} <> ?`, [b]];
    }

    static higher(a: any, b: any): PowerSQLStatementResult {
        return [`${a} > ?`, [b]];
    }

    static lower(a: any, b: any): PowerSQLStatementResult {
        return [`${a} < ?`, [b]];
    }

    static higherEqual(a: any, b: any): PowerSQLStatementResult {
        return [`${a} >= ?`, [b]];
    }

    static lowerEqual(a: any, b: any): PowerSQLStatementResult {
        return [`${a} <= ?`, [b]];
    }

    static like(a: any, b: any): PowerSQLStatementResult {
        return [`${a} LIKE ?`, [b]];
    }

    // AND / OR
    static and(...statements: MultipleStatements): PowerSQLStatementResult {
        const [sql, params] = unifyStatements(statements);
        return [`AND (${sql})`, params];
    }

    static or(...statements: MultipleStatements): PowerSQLStatementResult {
        const [sql, params] = unifyStatements(statements);
        return [`OR (${sql})`, params];
    }
};

export default PowerSQLDefaults;