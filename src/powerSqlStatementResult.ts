
export type SQL = string;
export type Param = any;
export type MultipleStatements = PowerSQLStatementResult[] | string[] | Array<string | PowerSQLStatementResult>;

type PowerSQLStatementResult = [ SQL, Array<Param> ] | [ SQL ];
export default PowerSQLStatementResult;