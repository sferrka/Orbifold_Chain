"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const xml2js = require("xml2js");
const Token_1 = require("./Token");
class Serialization_Helper {
    /// Serializes an object.
    static SerializeObject(serializableObject, fileName) {
        if (serializableObject === null) {
            return;
        }
        try {
            const tagName = serializableObject.constructor.name;
            const xml = serializeObject(serializableObject);
            const str = `<?xml version="1.0"?><${tagName} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">${xml}</${tagName}>`;
            fs_1.writeFileSync(fileName, str);
        }
        catch (ex) {
            throw ex;
            // Log exception here
        }
    }
    /// Deserializes an xml file into an object list
    static DeSerializeObject(fileName, objType = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileName) {
                if (objType) {
                    return Promise.resolve(new objType());
                }
                else {
                    return Promise.resolve({});
                }
            }
            const res = yield new Promise((resolve, reject) => {
                xml2js.parseString(fs_1.readFileSync(fileName).toString(), (err, obj) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(obj);
                });
            });
            const root = res[Object.keys(res)[0]];
            delete root.$;
            return deserializeObject(root);
        });
    }
}
exports.Serialization_Helper = Serialization_Helper;
function serializeObject(obj) {
    const fields = Object.keys(obj);
    let res = ``;
    for (const fieldName of fields) {
        const value = obj[fieldName];
        const valueInfo = serializeValue(value);
        res += `<${fieldName}${valueInfo.isArray ? ` list="true"` : ""}${valueInfo.attrs ? valueInfo.attrs : ""}>` + valueInfo.value + `</${fieldName}>`;
    }
    return res;
}
exports.serializeObject = serializeObject;
function serializeValue(value) {
    if (Array.isArray(value)) {
        const res = [];
        for (const item of value) {
            let attrs = "";
            let tagName = "item";
            if (typeof (item) === "object") {
                tagName = item.constructor.name;
                if (item instanceof Token_1.default) {
                    attrs = ` xsi:type="${tagName}"`;
                    tagName = "Token";
                }
            }
            const serValue = serializeValue(item);
            res.push(`<${tagName}${attrs}>` + serValue.value + `</${tagName}>`);
        }
        return { value: res.join(""), isArray: true };
    }
    if (typeof (value) === "object") {
        if (value instanceof Date) {
            return { value: value.toISOString() };
        }
        let attrs = "";
        if (value instanceof Token_1.default) {
            attrs = ` xsi:type="${value.constructor.name}"`;
        }
        return { attrs, value: serializeObject(value) };
    }
    if (typeof (value) === "string") {
        return {
            value: value
                .replace(/\"/gi, "&quot;")
                .replace(/\'/gi, "&apos;")
                .replace(/\</gi, "&lt;")
                .replace(/\>/gi, "&gt;")
                .replace(/\&>/gi, "&amp;"),
        };
    }
    if (typeof (value) === "number") {
        return { value: value.toString() };
    }
    if (typeof (value) === "boolean") {
        return { value: value ? "true" : "false" };
    }
    return { value: "" };
}
exports.serializeValue = serializeValue;
function deserializeValue(value) {
    if (Array.isArray(value)) {
        value = value[0];
        if (typeof (value) === "object" && value.$ && value.$.list === "true") {
            delete value.$;
            let out = [];
            for (const item of Object.keys(value)) {
                const field = value[item];
                if (Array.isArray(field)) {
                    out = out.concat(field.map(deserializeValue));
                }
                else {
                    out.push(deserializeValue(field));
                }
            }
            return out;
        }
    }
    if (Array.isArray(value)) {
        return value.map(deserializeValue);
    }
    if (typeof (value) === "object") {
        delete value.$;
        return deserializeObject(value);
    }
    if (typeof (value) === "string") {
        const dt = new Date(value);
        if (dt.getTime() > 0) {
            return dt;
        }
    }
    if (value === "true" || value === "false") {
        return value === "true" ? true : false;
    }
    const fl = parseFloat(value);
    if (fl.toString() === value) {
        return fl;
    }
    const int = parseInt(value, 10);
    if (int.toString() === value) {
        return int;
    }
    return value.replace(/&quot;/gi, `"`)
        .replace(/&apos;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&amp;>/gi, "&");
}
exports.deserializeValue = deserializeValue;
function deserializeObject(obj) {
    const fields = Object.keys(obj);
    const newObj = {};
    for (const fieldName of fields) {
        const value = obj[fieldName];
        newObj[fieldName] = deserializeValue(value);
    }
    return newObj;
}
exports.deserializeObject = deserializeObject;
exports.default = Serialization_Helper;
