import { PowerSQLStatement, PowerSQLStatementFactory } from './powerSqlStatement';
import sqlTypes from './sqlTypes';
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

/**
 * Select what (or '*')
 * @param string what to select - Optional 
 */
const select = PowerSQLStatementFactory('SELECT $', (...args: string[]) => {
    const arr = ((!args || args.length === 0) ? ['*'] : args);

	return arr.join(', ');
});

/**
 * FROM table
 * @param PowerSQLTable The table to select from
 */
const from = PowerSQLStatementFactory('FROM $', (args: PowerSQLTable) => {
    
    if (!args) {
        throw new Error('Invalid table!');
    }

    return args.name;
})

/**
 * WHERE condition
 * @param string condition
 */
const where = PowerSQLStatementFactory('WHERE $', (whereCond: string) => {
    if (typeof whereCond !== 'string') {
        throw new Error(`string expected! ${typeof whereCond} (${whereCond}) received!`);
    }
	return whereCond;
});

/**
 * UPDATE `table`
 * @param {PowerSQLTable} table - The table to update
 */
const update = PowerSQLStatementFactory('UPDATE $', (table: PowerSQLTable) => {
    
    if (!table) {
        throw new Error('Invalid table!');
    }

    return table.name;
})

/**
 * SET `data`
 * @param {any} data - The data to set
 */
const set = PowerSQLStatementFactory('SET $', (modify: any) => {

    let code = [];
    if (!modify) {
        throw new Error('Cannot modify null!');
    }

    for (let column in modify) {
        let value = param(modify[column]);
        code.push(`${column} = ${value}`);
    }

	return code.join(', ');
});


/**
 * CREATE TABLE IF NOT EXISTS `table` (`tableColumns`)
 * @param PowerSQLTable The table to create 
 */
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

/**
 * INSERT INTO `table` VALUES (`object`)
 * @param PowerSQLTable The table to insert data
 * @param any The object to insert into the table
 * @param boolean Optional (default: true) Validate types
 */
const insertInto = PowerSQLStatementFactory('INSERT INTO $ ($) VALUES ($)', 
(table: PowerSQLTable, objectToInsert: any, validate: Boolean = true) => {

    if (!(table instanceof PowerSQLTable)) {
        throw new Error(`PowerSQLTable expected! ${typeof table} received!`);
    }

    if (typeof objectToInsert != 'object') {
        throw new Error(`Object expected! ${typeof objectToInsert} received!`);
    }

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

                const jsType: string = typeof val;
                const sqlType: string[] | null = sqlTypes.getSqlTypes(jsType);
                if (!sqlType) {
                    throw new Error(`Invalid type: ${jsType}!`);
                }
                if (sqlType.indexOf(upType) === -1) {
                    throw new Error(`Type conflict at ${column.name}! ${sqlType} expected, ${upType} (JS: ${jsType} ${val}) received!`);
                }

                val = param(val);

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

/**
 * SELECT * FROM `table` WHERE `keysToMatch`
 * @param PowerSQLTable The table to select from
 * @param any The desired object to match with the column values
 */
const selectObject = PowerSQLStatementFactory('SELECT * FROM $ WHERE $', (table: PowerSQLTable, desiredObject: any) => {
    if (!table || !desiredObject) {
        throw new Error('Table and desired object expected!');
    }

    let whereConditions = [];    

    for (let columnName in desiredObject) {
        const columnValue = desiredObject[columnName];

        const column = table.getColumn(columnName);
        if (!table) {
            throw new Error(`Column "${columnName}" does not exists at table ${table.name}!`);
        }
        
        whereConditions.push(equal(column.name, param(columnValue, column.type)));
    }

    return [table.name, whereConditions.join(' AND ')];

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

const param = PowerSQLStatementFactory('$', (...args) => {
    const [paramValue, paramSQLType] = args;
    let jsType;
    if (paramSQLType) {
        jsType = sqlTypes.getJsType(paramSQLType);
    }
    else {
        jsType = typeof(paramValue);
    }

    return sqlTypes.sqlEscapeToString(paramValue, jsType);
});

const PowerSQLDefaults = { 
    select,
    where,
    from,
    insertInto,
    createTable,
    selectObject,
    update,
    set,

    equal,
    notEqual,

    higher,
    lower,

    higherEqual,
    lowerEqual,

    like,

    and,
    or,

    group,
    param
}

export default PowerSQLDefaults;