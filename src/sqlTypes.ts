const typesPair: any = {
    'number': [
        'INT',
        'TINYINT',
        'SMALLINT',
        'MEDIUMINT',
        'BIGINT',
        'INTEGER',
        'FLOAT',
        'DOUBLE',
        'DOUBLE PRECISION',
        'DECIMAL',
        'DEC',
        'BIT'
    ],
    'boolean': [
        'BIT',
        'BOOL',
        'BOOLEAN',
    ],
    'string': [
        'CHAR',
        'VARCHAR',
        'BINARY',
        'VARBINARY',
        'TINYTEXT',
        'MEDIUMTEXT',
        'LONGTEXT',
        'TEXT',
    ],
    'object': [
        'BLOB',
        'TINYBLOB',
        'MEDIUMBLOB',
        'LONGBLOB'
    ]
};

function getSqlTypes(jsType: string): string[] | null {
    if (jsType === undefined) {
        throw new Error('jsType is undefined! String expected!');
    }
    return typesPair[jsType] || null;
}

function getJsType(sqlType: string): string | null {
    if (sqlType === undefined) {
        throw new Error('sqlType is undefined! String expected!');
    }
    if (sqlType.includes('(')) {
        // example: VARCHAR(something)
        sqlType = sqlType.substring(0, sqlType.indexOf('(')).trim();
    }
    for (let jsType in typesPair) {
        const sqlTypes: string[] = typesPair[jsType];
        
        if (sqlTypes.includes(sqlType.toUpperCase())) {
            return jsType;
        }
    }
    return null;
}


const howToEscape: any = {
    'string': (str: string) => `'${String(str).replace(/'/g, "''")}'`,
    'object': (obj: any) => howToEscape['string'](JSON.stringify(obj)),
    'number': (num: number) => {
        if (typeof num === 'number') {
            return String(num).toString();
        }

        throw new Error(`number expected! ${typeof(num)} received!`);
    }
}

function sqlEscapeToString(value, jsType): string {
    if (!jsType) {
        throw new Error('jsType expected!');
        
    }
    const escapeFn = howToEscape[jsType];
    if (!escapeFn) {
        throw new Error(`Could not escape type "${jsType}"!`);
    }
    return escapeFn(value);
}

const sqlTypes = {
    getJsType,
    getSqlTypes,

    sqlEscapeToString
}

export default sqlTypes;