class PowerSQLTableColumn {
	name: string;
	type: string;
	attributes: Array<string>;

	constructor(Name: string, Type: string, Attributes: Array<string> = []) {
		this.name = Name;
		this.type = Type;
		this.attributes = Attributes;
	}
}

class PowerSQLTable {
	name: string;
	columns: Array<PowerSQLTableColumn>;

	constructor(Name: string, Columns: Array<PowerSQLTableColumn>) {
		this.name = Name;
		this.columns = Columns;
	}
}

export { PowerSQLTable, PowerSQLTableColumn };