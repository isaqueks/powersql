declare class PowerSQLTableColumn {
    private _name;
    private _type;
    private _attributes;
    get name(): string;
    get type(): string;
    get attributes(): Array<string>;
    constructor(Name: string, Type: string, Attributes?: Array<string>);
}
declare class PowerSQLTable {
    private _name;
    private _columns;
    get name(): string;
    get columns(): Array<PowerSQLTableColumn>;
    constructor(Name: string, Columns: Array<PowerSQLTableColumn>);
    getColumn(columnName: string): PowerSQLTableColumn | null;
    hasColumn(columnName: string, type?: string | undefined): boolean;
}
export { PowerSQLTable, PowerSQLTableColumn };
