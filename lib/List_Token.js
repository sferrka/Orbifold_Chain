"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = require("./Token");
class List_Token extends Token_1.default {
    constructor() {
        super(...arguments);
        this.tokens = [];
    }
}
exports.List_Token = List_Token;
exports.default = List_Token;
