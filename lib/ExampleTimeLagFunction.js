"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_Functions_1 = require("./User_Functions");
class ExampleTimeFunction {
    constructor() {
        this.TimeLagFunctionName = "ExampleTimeFunction";
    }
    TimeLagFunction(inputTime) {
        const n = new User_Functions_1.default();
        const m = n.AddOneDayFunction(inputTime);
        return n.AddOneDayFunction(m);
    }
}
exports.ExampleTimeFunction = ExampleTimeFunction;
exports.default = ExampleTimeFunction;
