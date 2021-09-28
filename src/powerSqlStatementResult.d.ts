export declare type SQL = string;
export declare type Param = any;
export declare type MultipleStatements = PowerSQLStatementResult[] | string[] | Array<string | PowerSQLStatementResult>;
declare type PowerSQLStatementResult = [SQL, Array<Param>] | [SQL];
export default PowerSQLStatementResult;
