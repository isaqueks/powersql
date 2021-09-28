import PowerSQL from "../src/powerSql";
import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const testTable = new PowerSQLTable('testTable', [
    new PowerSQLTableColumn('id', 'INT', ['NOT NULL'])
])

test('PowerSQL', () => {


    const query = PowerSQL(
        [ 'SELECT *' ],
        [ 'FROM testTable' ], 
        [ 'WHERE id = ? AND name = ?', [ 5, 'Test' ] ],
        [ 'OR column = ?', [ false ] ]
    );

    expect(query).toEqual([`SELECT * FROM testTable WHERE id = ? AND name = ? OR column = ?;`, [5, 'Test', false]]);
    

});