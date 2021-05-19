class PowerSQLStatementTemplate {

	template: string;
	execute: Function;

	constructor(Template: string, Execute: Function) {
		this.template = Template;
		this.execute = Execute;
	}

	toSql(): string {

		let sqlItems: string[] | string = this.execute.apply(this, arguments);
		if (!Array.isArray(sqlItems)) {
			sqlItems = [sqlItems];
		}
		
		const templateDivided: string[] = this.template.split('$');
		let result: string = '';

		let i = 0;
		for (let templateItem of templateDivided) {
			result += templateItem + (i <= sqlItems.length - 1 ? sqlItems[i++] : '');
		}

		return `${result} `;
	}
}

export default PowerSQLStatementTemplate;
