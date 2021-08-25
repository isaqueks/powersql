import { PowerSQLStatement } from './powerSqlStatement';
declare const PowerSQLDefaults: {
    select: PowerSQLStatement;
    where: PowerSQLStatement;
    from: PowerSQLStatement;
    insertInto: PowerSQLStatement;
    createTable: PowerSQLStatement;
    selectObject: PowerSQLStatement;
    update: PowerSQLStatement;
    set: PowerSQLStatement;
    equal: PowerSQLStatement;
    notEqual: PowerSQLStatement;
    higher: PowerSQLStatement;
    lower: PowerSQLStatement;
    higherEqual: PowerSQLStatement;
    lowerEqual: PowerSQLStatement;
    like: PowerSQLStatement;
    and: PowerSQLStatement;
    or: PowerSQLStatement;
    group: PowerSQLStatement;
    param: PowerSQLStatement;
};
export default PowerSQLDefaults;
