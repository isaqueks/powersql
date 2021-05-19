import { PowerSQLStatement, PowerSQLStatementFactory } from './powerSqlStatement';
import { PowerSQLTable } from './table';

function _sqlCompare(args: string[]): string[] {

	if (args.length !== 2) {
		throw new Error(`2 arguments expected, ${args} received!`);
	}

	return args;

}

function _getArrayOfStringsExecutor(maxLength: number | undefined = undefined) {
	return function (args: string[] | string): string[] {
		
		const asArray = Array.isArray(args) ? args : [args];

		if (maxLength && args.length > maxLength) {
			throw new Error(`${maxLength} arguments expected! ${args.length} received!`);
		}

		return asArray;
	}
}

const select = PowerSQLStatementFactory('SELECT $', (args: string[] | undefined) => {
    const arr = (args || ['*']);

    
	return arr.join(', ');
    
});

const from = PowerSQLStatementFactory('FROM $', (args: PowerSQLTable | PowerSQLTable[]) => {
    if (Array.isArray(args) && args.length === 1)
        args = args[0];

    return (args as PowerSQLTable).name;
})

const where = PowerSQLStatementFactory('WHERE $', (args: string | string[]) => {
	if (Array.isArray(args)) {
		const argsAsArray = args as string[];
		return argsAsArray.join(' ');
	}
	return args as string;
});

const createTable = PowerSQLStatementFactory('CREATE TABLE IF NOT EXISTS $ ($)',
([table]: PowerSQLTable[]) => {
    let tableColumns = '';

    let i = 0;
    for (let column of table.columns) {
        const coma = (++i >= table.columns.length ? '' : ', '); 
        let attrs = column.attributes;
        let attrsStr = attrs.length > 0 ? ' ' + attrs.join(' ') : '';
        tableColumns += `${column.name} ${column.type}${attrsStr}${coma}`;
    }
    return [table.name, tableColumns.trim()];
});

const insertInto = PowerSQLStatementFactory('INSERT INTO $ ($) VALUES($)', 
(table: PowerSQLTable, object: any, validate: Boolean = true) => {

    console.log(table, object, validate);
    

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

    let values = '';
    let sequence = '';

    let i = 0;
    for (let column of table.columns) {

        let val: any = object[column.name];
        let upType = column.type.toUpperCase();
        if (upType.includes('(')) {
            upType = upType.substring(0, upType.indexOf('(')-1).trim();
        }

        if (val === undefined) {
            val = null;
        }

        if (validate) {
            let attrs: string = column.attributes.join(' ').toUpperCase();
            if (val === null && attrs.includes('NOT NULL')) {
                throw new Error(`Null received at column ${column.name} [${attrs}] (Table ${table.name})!`);
            }
            else if (val !== null) {

                const type: string = typeof val;
                const sqlType: string[] = typesPair[type];
                if (!sqlType) {
                    throw new Error(`Invalid type: ${type}!`);
                }
                if (sqlType.indexOf(upType) === -1) {
                    throw new Error(`Type conflict! ${sqlType} expected, ${upType} (JS: ${type} ${val}) received!`);
                }

            }
            else if (val === null) {
                continue;
                // If val is NULL and Table accepts it, just ignore ...
            }
        }

        let coma = i > 0 ? ', ' : '';
        sequence += `${coma}${column.name}`;
        values += `${coma}${val}`;

        i++;
    }

    return [table.name, sequence.trim(), values.trim()];

});

const equal = PowerSQLStatementFactory('$ = $', _sqlCompare);
const notEqual = PowerSQLStatementFactory('$ <> $', _sqlCompare);

const higher = PowerSQLStatementFactory('$ > $', _sqlCompare);
const lower = PowerSQLStatementFactory('$ < $', _sqlCompare);

const higherEqual = PowerSQLStatementFactory('$ >= $', _sqlCompare);
const lowerEqual = PowerSQLStatementFactory('$ <= $', _sqlCompare);

const like = PowerSQLStatementFactory('$ LIKE $', _sqlCompare);


const and = PowerSQLStatementFactory('AND $', _getArrayOfStringsExecutor(1));
const or = PowerSQLStatementFactory('OR $', _getArrayOfStringsExecutor(1));

const group = PowerSQLStatementFactory('($)', _getArrayOfStringsExecutor());

// const PowerSQLDefaults = {
// 	select: _selectStatement,
// 	where: _whereStatement,

//     insertInto: _insertInto,
//     createTable: _createTable,

// 	equal: _equalOperator,
// 	notEqual: _notEqualOperator,

// 	higher: _higherOperator,
// 	lower: _lowerOperator,

// 	higherOrEqual: _highOrEqualOperator,
// 	lowerOrEqual: _lowerOrEqualOperator,

//     like: _likeOperator,

// 	and: _sqlAndOperator,
// 	or: _sqlOrOperator,

// 	group: _sqlGroup

// }

// export default PowerSQLDefaults;

const PowerSQLDefaults = { 
    select,
    where,
    from,
    insertInto,
    createTable,

    equal,
    notEqual,

    higher,
    lower,

    higherEqual,
    lowerEqual,

    like,

    and,
    or,

    group
}

export default PowerSQLDefaults;