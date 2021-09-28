"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PowerSQL(...statements) {
    const resultSQL = [];
    const resultParams = [];
    for (const statement of statements) {
        if (typeof statement === 'string') {
            resultParams.push(statement);
        }
        else if (typeof statement === 'object') {
            const [sql, params] = statement;
            resultSQL.push(sql);
            params === null || params === void 0 ? void 0 : params.forEach(param => resultParams.push(param));
        }
    }
    return [resultSQL.join(' ').concat(';'), resultParams];
}
exports.default = PowerSQL;
