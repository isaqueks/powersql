import { MultipleStatements } from "./powerSqlStatementResult";
declare function PowerSQL(...statements: MultipleStatements): [string, Array<any>];
export default PowerSQL;
