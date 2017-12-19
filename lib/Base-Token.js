"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
class Base_Token extends Token_1.default {
    constructor() {
        super(...arguments);
        this.description = ""; // Description e.g. ''Pay bearer one USD''
        this.hash = ""; // Hash of legal text defining Token.
    }
}
exports.Base_Token = Base_Token;
exports.default = Base_Token;
