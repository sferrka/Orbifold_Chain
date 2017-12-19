"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
class Security_Token extends Token_1.default {
    constructor() {
        super(...arguments);
        // Strictly asset flag
        this.asset = false;
        // Strictly liability flag
        this.liability = false;
    }
}
exports.Security_Token = Security_Token;
exports.default = Security_Token;
