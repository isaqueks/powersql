import PowerSQL from "./src/powerSql";
import sql from "./src/powerSqlDefaults";
import { PowerSQLTable, PowerSQLTableColumn } from "./src/table";

// Select('id', 'name').from('tableName').where(equal('x, 'y').and(group(not_equal('x', param(y)))))


/* PowerSQL.CreateTable({
	name: 'myTable',
	columns: {
		id: 'PRIMARY KEY AUTOINCREMENT NOT NULL',
		name: 'TEXT'
	}
}) */

/* PowerSQL.Select('*').From(myTable).whereEquals({
	id: 1,
	password: 'password123'
}) */

let table = new PowerSQLTable('users', [
    new PowerSQLTableColumn('id', 'INTEGER', ['AUTOINCREMENT', 'PRIMARY KEY']),
    new PowerSQLTableColumn('name', 'TEXT'),
    new PowerSQLTableColumn('email', 'TEXT', ['NOT NULL'])
]);

const demoUser = {
    name: 'Isaque',
    email: 'iskschluter@gmail.com'
}

console.log(
    PowerSQL(sql.insertInto(table, demoUser))
);
