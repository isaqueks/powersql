import PowerSQL from "../src/powerSql";
import psql from '../src/powerSqlDefaults';
import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const testTable = new PowerSQLTable('testTable', [
    new PowerSQLTableColumn('id', 'INT', ['NOT NULL'])
])

test('PowerSQL - Final', () => {


    expect(PowerSQL(
        psql.select('*'), psql.from(testTable), psql.where(psql.equal('id', psql.param(46)))
    )).toEqual(`SELECT * FROM testTable WHERE id = 46;`);

});