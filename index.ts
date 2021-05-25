import PowerSQL from "./src/powerSql";
import SqlDefaults from "./src/powerSqlDefaults";
import sqlTypes from "./src/sqlTypes";
import { PowerSQLTable, PowerSQLTableColumn } from "./src/table";

const power = {
    PowerSQL,
    PowerSQLDefaults: SqlDefaults,
    PowerSQLTypes: sqlTypes,
    PowerSQLTable: PowerSQLTable,
    PowerSQLTableColumn: PowerSQLTableColumn
}

export default power;