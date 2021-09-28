import PowerSQLStatementResult from "./powerSqlStatementResult";

function PowerSQL(...statements: PowerSQLStatementResult[]): [ string, Array<any> ] {

    const resultSQL = [];
    const resultParams = [];

    for (const statement of statements) {
        const [ sql, params ] = statement;
        resultSQL.push(sql);
        params?.forEach(param => resultParams.push(param));
    }

    return [ resultSQL.join(' ').concat(';'), resultParams ];
}

export default PowerSQL;