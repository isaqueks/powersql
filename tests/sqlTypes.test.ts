import sqlTypes from "../src/sqlTypes";

const xyz: any = {};

test('sqlTypes (JS to SQL)', () => {
    expect(sqlTypes.getJsType('TEXT')).toEqual('string');
    expect(sqlTypes.getJsType('text')).toEqual('string');

    expect(sqlTypes.getJsType('INTEGER')).toEqual('number');
    expect(sqlTypes.getJsType('int')).toEqual('number');

    expect(sqlTypes.getJsType('xyz')).toEqual(null);

    expect(() => sqlTypes.getJsType(xyz.abc /* trick to TS compiler = undefined */)).toThrowError();
});

test('sqlTypes (JS to SQL)', () => {
    expect(sqlTypes.getSqlTypes('string')).toContain('TEXT');
    expect(sqlTypes.getSqlTypes('string')).toContain('CHAR');

    expect(() => sqlTypes.getSqlTypes(xyz.abc /* trick to TS compiler = undefined */)).toThrowError();

    expect(sqlTypes.getSqlTypes('xyz')).toEqual(null);
});

test('sqlTypes (escaping)', () => {

    expect(sqlTypes.sqlEscapeToString('hello world', 'string')).toEqual("'hello world'");
    expect(sqlTypes.sqlEscapeToString('hello\'world', 'string')).toEqual("'hello\'\'world'");

    expect(sqlTypes.sqlEscapeToString('hello\'world', 'string')).toEqual("'hello\'\'world'");

    expect(sqlTypes.sqlEscapeToString(46, 'number')).toEqual('46');

    expect(sqlTypes.sqlEscapeToString(null, 'string')).toEqual("'null'");

    expect(sqlTypes.sqlEscapeToString({ test: 'hello world' }, 'object')).toEqual("'{\"test\":\"hello world\"}'");

    expect(() => sqlTypes.sqlEscapeToString('46', 'number')).toThrow();
    expect(() => sqlTypes.sqlEscapeToString('46', 'inexistent type')).toThrow();
    expect(() => sqlTypes.sqlEscapeToString('hello world', null)).toThrow();
});

