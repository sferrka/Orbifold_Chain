import { readFileSync, writeFileSync } from "fs";
import xml2js = require("xml2js");
import Token from "./Token";

export class Serialization_Helper {
    /// Serializes an object.
    public static SerializeObject<T>(serializableObject: T, fileName: string) {
        if (serializableObject === null) { return; }
        try {
            const tagName = serializableObject.constructor.name;
            const xml = serializeObject(serializableObject);
            const str = `<?xml version="1.0"?><${tagName} xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">${xml}</${tagName}>`;
            writeFileSync(fileName, str);
        } catch (ex) {
            throw ex;
            // Log exception here
        }
    }
    /// Deserializes an xml file into an object list
    public static async DeSerializeObject<T>(fileName: string, objType: (new () => T) | null = null): Promise<T> {
        if (!fileName) {
            if (objType) {
                return Promise.resolve(new objType());
            } else {
                return Promise.resolve({} as any);
            }
        }

        const res = await new Promise<any>((resolve, reject) => {
            xml2js.parseString(readFileSync(fileName).toString(), (err, obj) => {
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
    }
}
export function serializeObject(obj: any) {
    const fields = Object.keys(obj);
    let res = ``;
    for (const fieldName of fields) {
        const value = obj[fieldName];
        const valueInfo = serializeValue(value);
        res += `<${fieldName}${valueInfo.isArray ? ` list="true"` : ""}${valueInfo.attrs ? valueInfo.attrs : ""}>` + valueInfo.value + `</${fieldName}>`;
    }
    return res;
}
export function serializeValue(value: any): { value: any, isArray?: boolean; attrs?: string } {
    if (Array.isArray(value)) {
        const res: any[] = [];
        for (const item of value) {
            let attrs = "";
            let tagName = "item";
            if (typeof (item) === "object") {
                tagName = item.constructor.name;
                if (item instanceof Token) {
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
        if (value instanceof Token) {
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
export function deserializeValue(value: any): any {
    if (Array.isArray(value)) {
        value = value[0];
        if (typeof (value) === "object" && value.$ && value.$.list === "true") {
            delete value.$;
            let out: any[] = [];
            for (const item of Object.keys(value)) {
                const field = value[item];
                if (Array.isArray(field)) {
                    out = out.concat(field.map(deserializeValue));
                } else {
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
export function deserializeObject(obj: any) {
    const fields = Object.keys(obj);
    const newObj: any = {};
    for (const fieldName of fields) {
        const value = obj[fieldName];
        newObj[fieldName] = deserializeValue(value);
    }
    return newObj;
}
export default Serialization_Helper;
