import PowerSQLStatementTemplate from "./powerSqlStatementTemplate";

interface PowerSQLStatement {
    (...args: any[]): string;
    template: PowerSQLStatementTemplate;
}

function PowerSQLStatementFactory(template: string, executor: Function): PowerSQLStatement {
    const result: any = function (): string {
        return (this as any).template.toSql.apply((this as any).template, arguments);
	}
    result.template = new PowerSQLStatementTemplate(template, executor);
    return result.bind(result);
}

export { PowerSQLStatement, PowerSQLStatementFactory };