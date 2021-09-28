import sql from "../src/powerSqlDefaults";
import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const testTable = new PowerSQLTable('testTable', [
    new PowerSQLTableColumn('id', 'INTEGER', ['NOT NULL']),
    new PowerSQLTableColumn('name', 'VARCHAR(128)')
]);

describe('PowerSQL Default methods', () => {

    describe('CRUD, WHERE operation methods', () => {
        
        test('SELECT', () => {

            expect(sql.select('id', 'name'))
                .toEqual([ 'SELECT id, name' ]);

            expect(sql.selectWhere(testTable, { id: 5, name: 'John' }))
                .toEqual([ 'SELECT * FROM testTable WHERE (id = ? AND name = ?)', [ 5, 'John' ] ]);

        });

        test('FROM', () => {

            expect(sql.from(testTable)).toEqual([ 'FROM testTable' ]);

        });

        test('WHERE', () => {

            expect(sql.where('id = ?', 'AND', 'name = ? OR id > ?'))
                .toEqual([ 'WHERE id = ? AND name = ? OR id > ?', [] ]);

            expect(sql.where(
                sql.equal('id', 5),
                sql.or(
                    sql.notEqual('name', 'John')
                )
            )).toEqual([ 'WHERE id = ? OR (name <> ?)', [ 5, 'John' ] ]);

        });

        test('CREATE TABLE', () => {

            expect(sql.createTable(testTable))
                .toEqual([`CREATE TABLE testTable (id INTEGER NOT NULL, name VARCHAR(128))`]);

            expect(sql.createTable(testTable, true))
                .toEqual([`CREATE TABLE IF NOT EXISTS testTable (id INTEGER NOT NULL, name VARCHAR(128))`]);

        });

        test('INSERT INTO', () => {

            expect(sql.insertInto(testTable, {
                id: 10,
                name: 'John'
            }))
            .toEqual([`INSERT INTO testTable (id, name) VALUES (?, ?)`, [ 10, 'John' ]])

        });

        test('DELETE', () => {

            expect(sql.delete())
            .toEqual([`DELETE`])

        });

        test('UPDATE', () => {

            expect(sql.update(testTable))
            .toEqual([`UPDATE testTable`])

        });

        test('SET', () => {

            expect(sql.set({
                id: 12,
                name: 'Isaque'
            }))
            .toEqual([`SET id = ?, name = ?`, [ 12, 'Isaque' ]])

        });

    });

    describe('Comparing operations', () => {

        test('Group (parenthesis)', () => {

            expect(sql.group(
                sql.like('name', 'Isaque'),
                'AND',
                sql.notEqual('id', 10)
            ))
            .toEqual([`(name LIKE ? AND id <> ?)`, [ 'Isaque', 10 ]])
        });

        test('Equal, notEqual, higher, lower, higherEqual, lowerEqual, like', () => {

            expect(sql.equal('name', 'PowerSQL')).toEqual([ 'name = ?', [ 'PowerSQL' ] ]);
            expect(sql.notEqual('name', 'PowerSQL')).toEqual([ 'name <> ?', [ 'PowerSQL' ] ]);

            expect(sql.higher('name', 'PowerSQL')).toEqual([ 'name > ?', [ 'PowerSQL' ] ]);
            expect(sql.lower('name', 'PowerSQL')).toEqual([ 'name < ?', [ 'PowerSQL' ] ]);

            expect(sql.higherEqual('name', 'PowerSQL')).toEqual([ 'name >= ?', [ 'PowerSQL' ] ]);
            expect(sql.lowerEqual('name', 'PowerSQL')).toEqual([ 'name <= ?', [ 'PowerSQL' ] ]);

            expect(sql.like('name', 'PowerSQL')).toEqual([ 'name LIKE ?', [ 'PowerSQL' ] ]);

        });

        test('AND, OR', () => {
            expect(sql.and(
                'column = value', 'AND', 'x = y', 'OR',
                sql.higherEqual('id', 12)
            )).toEqual([ 'AND (column = value AND x = y OR id >= ?)', [12] ]);
            expect(sql.or('condition')).toEqual([ 'OR (condition)', [] ]);
        })

    });

});