import PowerSQL from "../src/powerSql";
import sql from "../src/powerSqlDefaults";
import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const testTable = new PowerSQLTable('testTable', [
    new PowerSQLTableColumn('id', 'INTEGER', ['NOT NULL']),
    new PowerSQLTableColumn('name', 'VARCHAR(128)')
]);

test('Full query', () => {

    const query = PowerSQL(
        sql.select('id', 'name'),
        sql.from(testTable),
        sql.where(
            sql.group(
                sql.equal('id', 5),
                sql.and(sql.equal('name', 'Isaque')),
            ),
            sql.or(
                sql.like('name', '%PowerSQL%')
            )
        )
    );

    expect(query).toEqual([
        'SELECT id, name FROM testTable WHERE (id = ? AND (name = ?)) OR (name LIKE ?);',
        [ 5, 'Isaque', '%PowerSQL%' ]
    ]);
    

})