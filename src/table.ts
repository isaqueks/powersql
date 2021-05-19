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
}

export { PowerSQLTable, PowerSQLTableColumn };