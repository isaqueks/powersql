class PowerSQLTableColumn {
	private _name: string;
	private _type: string;
	private _attributes: Array<string>;

    public get name(): string {
        return this._name;
    }

    public get type(): string {
        return this._type;
    }

    public get attributes(): Array<string> {
        return this._attributes;
    }

	constructor(Name: string, Type: string, Attributes: Array<string> = []) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid column name! ${Name} received.`);
        }
        if (typeof Type != 'string' || !Type) {
            throw new Error(`Expected a valid type! ${Type} received.`);
        }
		this._name = Name;
		this._type = Type;
		this._attributes = Attributes;
	}
}

class PowerSQLTable {

	private _name: string;
	private _columns: Array<PowerSQLTableColumn>;

    public get name(): string {
        return this._name;
    }

    public get columns(): Array<PowerSQLTableColumn> {
        return this._columns;
    }

	constructor(Name: string, Columns: Array<PowerSQLTableColumn>) {
        if (typeof Name != 'string' || !Name) {
            throw new Error(`Expected a valid table name! ${Name} received.`);
        }
        if (!Columns || Columns.length <= 0) {
            throw new Error('At least 1 column expected!');
        }

		this._name = Name;
		this._columns = Columns;
	}

    public getColumn(columnName: string): PowerSQLTableColumn | null {
        if (columnName == undefined) {
            throw new Error('columnName expected! undefined received.');
        }
        for (let column of this._columns) {
            if (column.name === columnName) {
                return column;
            }
        }
        return null;
    }

    public hasColumn(columnName: string, type: string | undefined = undefined) {
        const col = this.getColumn(columnName);
        if (col && (type === undefined || col.type == type)) {
            return true;
        }
        return false;
    }
}

export { PowerSQLTable, PowerSQLTableColumn };