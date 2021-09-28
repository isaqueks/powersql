import PowerSQLStatementResult, { MultipleStatements } from "./powerSqlStatementResult";

function PowerSQL(...statements: MultipleStatements): [ string, Array<any> ] {

    const resultSQL = [];
    const resultParams = [];

    for (const statement of statements) {
        if (typeof statement === 'string') {
            resultSQL.push(statement);
        }
        else if (typeof statement === 'object') {
            const [ sql, params ] = statement;
            resultSQL.push(sql);
            params?.forEach(param => resultParams.push(param));
        }
    }

    return [ resultSQL.join(' ').concat(';'), resultParams ];
}

export default PowerSQL;