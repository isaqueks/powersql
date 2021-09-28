
export type SQL = string;
export type Param = any;

type PowerSQLStatementResult = [ SQL, Array<Param> ] | [ SQL ];

export default PowerSQLStatementResult;