import PowerSQLStatementTemplate from "../src/powerSqlStatementTemplate";

const statement = new PowerSQLStatementTemplate('$ AND $', (a: string, b: string) => {

    if (typeof a != 'string') {
        throw new Error('string expected for a!');
    }
    if (typeof b != 'string') {
        throw new Error('string expected for b!');
    }

    return [a, b];

});

test('Statement result', () => {

    expect(statement.toSql('hello', 'world')).toEqual('hello AND world');

}); 

test('Statement exception', () => {

    expect(() => statement.toSql('hello')).toThrowError('string expected for b!');

}); 

test('Statement exception', () => {

    expect(() => statement.toSql()).toThrowError('string expected for a!');

}); 


const statementThatReturnsSingleString = new PowerSQLStatementTemplate('OR $', (a: string) => {

    // if (typeof a != 'string') {
    //     throw new Error('string expected for a!');
    // }
    // Exceptions are already tested

    return a;

});

test('Single string statement test', () => {
    
    expect(statementThatReturnsSingleString.toSql('Hello World')).toEqual('OR Hello World');

});