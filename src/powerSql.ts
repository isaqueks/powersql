
function PowerSQL(...statements: string[]) {
    let sql = '';
    for (let statement of statements) {
        sql += statement;
    }

    return sql.trim()+';';
}

export default PowerSQL;