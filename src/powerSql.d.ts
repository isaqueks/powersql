import PowerSQLStatementResult from "./powerSqlStatementResult";
declare function PowerSQL(...statements: PowerSQLStatementResult[]): [string, Array<any>];
export default PowerSQL;
