class PowerSQLTableColumn {
	name: string;
	type: string;
	attributes: Array<string>;

	constructor(Name: string, Type: string, Attributes: Array<string> = []) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid column name! ${Name} received.`);
        }
        if (typeof Type != 'string' || !Type) {
            throw new Error(`Expected a valid type! ${Type} received.`);
        }
		this.name = Name;
		this.type = Type;
		this.attributes = Attributes;
	}
}

class PowerSQLTable {
	name: string;
	columns: Array<PowerSQLTableColumn>;

	constructor(Name: string, Columns: Array<PowerSQLTableColumn>) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid table name! ${Name} received.`);
        }
        if (!Columns || Columns.length <= 0) {
            throw new Error('At least 1 column expected!');
        }

		this.name = Name;
		this.columns = Columns;
	}

    getColumn(columnName: string): PowerSQLTableColumn | null {
        if (columnName == undefined) {
            throw new Error('columnName expected! undefined received.');
        }
        for (let column of this.columns) {
            if (column.name === columnName) {
                return column;
            }
        }
        return null;
    }

    hasColumn(columnName: string, type: string | undefined = undefined) {
        const col = this.getColumn(columnName);
        if (col && (type === undefined || col.type == type)) {
            return true;
        }
        return false;
    }
}

export { PowerSQLTable, PowerSQLTableColumn };