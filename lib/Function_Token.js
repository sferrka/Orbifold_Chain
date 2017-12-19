"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
class Function_Token extends Token_1.default {
    constructor() {
        super(...arguments);
        this.amount = 0;
        /// The identifier string of a value function
        this.ValueFunctionName = "";
        /// The identifier string of a value function
        this.TimeLagFunctionName = "";
    }
}
exports.Function_Token = Function_Token;
exports.default = Function_Token;
