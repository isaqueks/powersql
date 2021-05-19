import { PowerSQLTable, PowerSQLTableColumn } from "../src/table";

const table: PowerSQLTable = new PowerSQLTable('Users', [
    new PowerSQLTableColumn('id', 'INTEGER', ['PRIMARY KEY', 'AUTOINCREMENT']),
    new PowerSQLTableColumn('name', 'TEXT', ['NOT NULL'])
]);

test('Invalid table constructor parameters', () => {
    expect(() => new PowerSQLTable('', [])).toThrowError();
    expect(() => new PowerSQLTable('MyTable', [])).toThrowError();
});

test('Invalid column constructor parameters', () => {
    expect(() => new PowerSQLTableColumn('', 'INTEGER')).toThrowError();
    expect(() => new PowerSQLTableColumn('id', '')).toThrowError();
});

test('Table name constructor', () => {
    expect(table.name).toBe('Users');
});

test('Table columns', () => {

    expect(table.columns.length).toBe(2);

    expect(table.columns[0].name).toBe('id');
    expect(table.columns[1].name).toBe('name');

    expect(table.columns[0].type).toBe('INTEGER');
    expect(table.columns[1].type).toBe('TEXT');

    expect(table.columns[0].attributes.length).toBe(2);
    expect(table.columns[1].attributes.length).toBe(1);

});