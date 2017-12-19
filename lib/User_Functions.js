"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User_Functions {
    AddOneDayFunction(inputTime) {
        return new Date(+inputTime + 86400);
    }
}
exports.default = User_Functions;
