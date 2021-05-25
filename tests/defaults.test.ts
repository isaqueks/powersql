import psql from "../src/powerSqlDefaults";
import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const testTable = new PowerSQLTable('testTable', [
    new PowerSQLTableColumn('id', 'INTEGER', ['NOT NULL']),
    new PowerSQLTableColumn('name', 'VARCHAR(128)')
]);

test('SELECT', () => {
    expect(psql.select('x', 'y')).toEqual('SELECT x, y');
    expect(psql.select()).toEqual('SELECT *');
});


test('FROM', () => {
    expect(psql.from(testTable)).toEqual('FROM testTable');
    expect(() => psql.from(null)).toThrowError();
});


test('WHERE', () => {
    expect(psql.where('y')).toEqual('WHERE y');

    expect(() => psql.where(null)).toThrowError();
    expect(() => psql.where(128)).toThrowError();
});

test('CREATE TABLE', () => {
    expect(psql.createTable(testTable)).toEqual('CREATE TABLE IF NOT EXISTS testTable (id INTEGER NOT NULL, name VARCHAR(128))');
    expect(() => psql.createTable(null)).toThrowError();
});

test('INSERT INTO', () => {

    // Should work
    const dataToInsert_01 = {
        id: 1,
        name: 'John'
    };

    // Shouldn't work (id = NOT NULL)
    const dataToInsert_02 = {
        name: 'John'
    };

    // Should work
    const dataToInsert_03 = {
        id: 1
    };

    // Should not work (id = INTEGER)
    const dataToInsert_04 = {
        id: '1',
        name: 'John'
    };

    // Should not work (name = TEXT)
    const dataToInsert_05 = {
        id: 1,
        name: 5
    };

    expect(psql.insertInto(testTable, dataToInsert_01)).toEqual('INSERT INTO testTable (id, name) VALUES (1, John)');
    expect(psql.insertInto(testTable, dataToInsert_03)).toEqual('INSERT INTO testTable (id) VALUES (1)');
    
    expect(() => psql.insertInto()).toThrowError();
    expect(() => psql.insertInto(testTable, dataToInsert_02)).toThrowError();
    expect(() => psql.insertInto(testTable, dataToInsert_04)).toThrowError();
    expect(() => psql.insertInto(testTable, dataToInsert_05)).toThrowError();

});

test('Operators', () => {

    function testOperator(fn, op) {
        expect(fn('a', 'b')).toEqual(`a ${op} b`);
        expect(() => fn()).toThrowError();
        expect(() => fn('a')).toThrowError(); // 2 args expected!
    }

    testOperator(psql.equal, '=');
    testOperator(psql.notEqual, '<>');

    testOperator(psql.higher, '>');
    testOperator(psql.lower, '<');

    testOperator(psql.higherEqual, '>=');
    testOperator(psql.lowerEqual, '<=');

    testOperator(psql.like, 'LIKE');

})

test('Logical operators', () => {

    function testOperator(fn, op) {
        expect(fn('a')).toEqual(`${op} a`);
        expect(() => fn()).toThrowError();
    }

   testOperator(psql.and, 'AND');
   testOperator(psql.or, 'OR');
})

test('(Group)', () => {

    expect(psql.group(psql.equal('x', 'y'), psql.and(psql.equal(10, 10)))).toEqual('(x = y AND 10 = 10)');
    expect(() => psql.group()).toThrowError();

})

test('(Param)', () => {

    expect(psql.param('hello world')).toEqual("'hello world'");
    expect(psql.param(46)).toEqual('46');
    expect(psql.param(46, 'TEXT')).toEqual("'46'");

    expect(() => psql.param('hello world', 'inexistent sql type')).toThrowError();
    expect(() => psql.param()).toThrowError();

})

test('(SelectObject)', () => {

    const demoObject = {
        name: 'John'
    }

    const demoObject2 = {
        id: 5,
        name: 'Rose'
    }

    const errorObject = {
        inexistentColumn: 10
    }

    expect(psql.selectObject(testTable, demoObject)).toEqual("SELECT * FROM testTable WHERE name = 'John'");
    expect(psql.selectObject(testTable, demoObject2)).toEqual("SELECT * FROM testTable WHERE id = 5 AND name = 'Rose'");

    expect(() => psql.selectObject()).toThrowError();
    expect(() => psql.selectObject(testTable, errorObject)).toThrowError();

})