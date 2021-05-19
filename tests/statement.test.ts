import { PowerSQLStatementFactory } from "../src/powerSqlStatement";

const statement = PowerSQLStatementFactory('SELECT $ FROM $ WHERE $ = $', 
    (valuesToSelect: string, tableName: string, columnName: string, valueToCompare: number) => {

    if (typeof valuesToSelect !== 'string') {
        throw new Error('string expected for valuesToSelect!');
    }

    if (typeof tableName !== 'string') {
        throw new Error('string expected for tableName!');
    }

    if (typeof columnName !== 'string') {
        throw new Error('string expected for columnName!');
    }

    if (typeof valueToCompare !== 'number') {
        throw new Error('number expected for valueToCompare!');
    }

    return [
        valuesToSelect,
        tableName,
        columnName,
        valueToCompare
    ]

});

test('Statement exception test for invalid parameters type', () => {

    expect(() => statement(45, 'tableName', 'test', 45)).toThrowError('string expected for valuesToSelect!');
    expect(() => statement('*', 'tableName', 'columnTest', '45')).toThrowError('number expected for valueToCompare!');

});

test('Statement return result test', () => {

    expect(statement('*', 'tableName', 'columnTest', 45)).toEqual('SELECT * FROM tableName WHERE columnTest = 45');

});