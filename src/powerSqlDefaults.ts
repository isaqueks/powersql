import { PowerSQLStatement, PowerSQLStatementFactory } from './powerSqlStatement';
import { PowerSQLTable } from './table';

function _sqlCompare(...args: string[]): string[] {

	if (!args || args.length != 2) {
		throw new Error(`2 arguments expected, ${args} received!`);
	}

    if (typeof args[0] === undefined) {
        throw new Error(`Arg 0 is undefined!`);
    }

    if (typeof args[1] === undefined) {
        throw new Error(`Arg 1 is undefined!`);
    }

	return args;

}

function _getArrayOfStringsExecutor(minLength: number | undefined = undefined, maxLength: number | undefined = undefined) {
	return function (...args: string[]): string[] {
		
		if ((minLength !== undefined && args.length < minLength) ||
            (maxLength !== undefined && args.length > maxLength)) {
			throw new Error(`${minLength||0} - ${maxLength} arguments expected! ${args.length} received!`);
		}

		return args;
	}
}

const select = PowerSQLStatementFactory('SELECT $', (...args: string[]) => {
    const arr = ((!args || args.length === 0) ? ['*'] : args);

	return arr.join(', ');
});

const from = PowerSQLStatementFactory('FROM $', (args: PowerSQLTable) => {
    
    if (!args) {
        throw new Error('Invalid table!');
    }

    return args.name;
})

const where = PowerSQLStatementFactory('WHERE $', (whereCond: string) => {
    if (typeof whereCond !== 'string') {
        throw new Error(`string expected! ${typeof whereCond} (${whereCond}) received!`);
    }
	return whereCond;
});

const createTable = PowerSQLStatementFactory('CREATE TABLE IF NOT EXISTS $ ($)',
(table: PowerSQLTable) => {
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

const insertInto = PowerSQLStatementFactory('INSERT INTO $ ($) VALUES ($)', 
(table: PowerSQLTable, objectToInsert: any, validate: Boolean = true) => {

    if (!(table instanceof PowerSQLTable)) {
        throw new Error(`PowerSQLTable expected! ${typeof table} received!`);
    }

    if (typeof objectToInsert != 'object') {
        throw new Error(`Object expected! ${typeof objectToInsert} received!`);
    }
    


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

        let val: any = objectToInsert[column.name];
        let upType = column.type.toUpperCase();
        if (upType.includes('(')) {
            upType = upType.substring(0, upType.indexOf('(')).trim();
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


const and = PowerSQLStatementFactory('AND $', _getArrayOfStringsExecutor(1, 1));
const or = PowerSQLStatementFactory('OR $', _getArrayOfStringsExecutor(1, 1));

const group = PowerSQLStatementFactory('($)', (...args) => {
    if (!args || args.length <= 0) {
        throw new Error(`At least 1 arg expected!`);
    }
    
    return args.join(' ');
});

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