import { PowerSQLTable } from '..';
import PowerSQLStatementResult, { MultipleStatements } from './powerSqlStatementResult';
interface PowerSQLDefaultsContainer {
    [fn: string]: (...any: any[]) => PowerSQLStatementResult;
}
declare class PowerSQLDefaults implements PowerSQLDefaultsContainer {
    [fn: string]: (...any: any[]) => PowerSQLStatementResult;
    static select(...items: string[]): PowerSQLStatementResult;
    static selectWhere(table: PowerSQLTable, values: {
        [column: string]: any;
    }): PowerSQLStatementResult;
    static from(table: PowerSQLTable): PowerSQLStatementResult;
    static where(...conditions: MultipleStatements): PowerSQLStatementResult;
    static createTable(table: PowerSQLTable, sqlliteIfNotExists?: boolean): PowerSQLStatementResult;
    static insertInto(table: PowerSQLTable, values: {
        [column: string]: any;
    }): PowerSQLStatementResult;
    static delete(): PowerSQLStatementResult;
    static update(table: PowerSQLTable): PowerSQLStatementResult;
    static set(values: {
        [column: string]: any;
    }): PowerSQLStatementResult;
    static group(...statements: MultipleStatements): PowerSQLStatementResult;
    static equal(a: any, b: any): PowerSQLStatementResult;
    static notEqual(a: any, b: any): PowerSQLStatementResult;
    static higher(a: any, b: any): PowerSQLStatementResult;
    static lower(a: any, b: any): PowerSQLStatementResult;
    static higherEqual(a: any, b: any): PowerSQLStatementResult;
    static lowerEqual(a: any, b: any): PowerSQLStatementResult;
    static like(a: any, b: any): PowerSQLStatementResult;
    static and(...statements: MultipleStatements): PowerSQLStatementResult;
    static or(...statements: MultipleStatements): PowerSQLStatementResult;
}
export default PowerSQLDefaults;
