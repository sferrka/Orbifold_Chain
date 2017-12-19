"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base_Token_1 = require("./Base-Token");
const Function_Token_1 = require("./Function_Token");
const List_Token_1 = require("./List_Token");
const Option_Token_1 = require("./Option_Token");
const Security_Token_1 = require("./Security_Token");
// NormalToken: Takes a token and (i) puts any list component to the front and (ii) collapses any multiple security token (security token whose
// underlying token is a security token, etc) into a single security token. Done recursively so that the underlying token(s)
// of any normalised Token is either a base Token, Function Token, Option Token or Security Token. Returns a Token or Null.
// NormalListToken etc: applies to specific Token clases (e.g. List_Token) as part of the recursive definition of NormalToken.
class TokenNormaliser {
    NormalToken(token) {
        let return_value = null;
        if (token instanceof Base_Token_1.default) {
            return_value = token;
        }
        if (token instanceof List_Token_1.default) {
            return_value = this.NormalListToken(token);
        }
        if (token instanceof Function_Token_1.default) {
            return_value = this.NormalFunctionToken(token);
        }
        if (token instanceof Option_Token_1.default) {
            return_value = token;
        }
        if (token instanceof Security_Token_1.default) {
            return_value = this.NormalSecurityToken(token);
        }
        if (return_value === null) {
            throw new Error("In method NormalToken, unrecognised token type");
        }
        return return_value;
    }
    NormalListToken(listtoken) {
        const newnormallisttoken = new List_Token_1.default();
        for (let i = 0; i < listtoken.tokens.length; i++) {
            const normaltoken = this.NormalToken(listtoken.tokens[i]);
            if (normaltoken instanceof List_Token_1.default) {
                const normallisttoken = normaltoken;
                for (let j = 0; j < normallisttoken.tokens.length; j++) {
                    newnormallisttoken.tokens.push(normallisttoken.tokens[j]);
                }
            }
            else {
                newnormallisttoken.tokens.push(normaltoken);
            }
        }
        const return_value = newnormallisttoken;
        return return_value;
    }
    NormalFunctionToken(functiontoken) {
        let return_value = null;
        const normaltoken = this.NormalToken(functiontoken.token);
        if (normaltoken instanceof List_Token_1.default) {
            const normallisttoken = normaltoken;
            const newnormallisttoken = new List_Token_1.default();
            for (let i = 0; i < normallisttoken.tokens.length; i++) {
                const newfunctiontoken = new Function_Token_1.default();
                newfunctiontoken.amount = functiontoken.amount;
                newfunctiontoken.datetime = functiontoken.datetime;
                newfunctiontoken.token = normallisttoken.tokens[i];
                newfunctiontoken.ValueFunctionName = functiontoken.ValueFunctionName;
                newfunctiontoken.TimeLagFunctionName = functiontoken.TimeLagFunctionName;
                newnormallisttoken.tokens.push(newfunctiontoken);
            }
            return_value = newnormallisttoken;
        }
        else {
            const newfunctiontoken = new Function_Token_1.default();
            newfunctiontoken.amount = functiontoken.amount;
            newfunctiontoken.datetime = functiontoken.datetime;
            newfunctiontoken.token = normaltoken;
            newfunctiontoken.ValueFunctionName = functiontoken.ValueFunctionName;
            newfunctiontoken.TimeLagFunctionName = functiontoken.TimeLagFunctionName;
            return_value = newfunctiontoken;
        }
        return return_value;
    }
    NormalSecurityToken(securitytoken) {
        let return_value = null;
        const normaltoken = this.NormalToken(securitytoken.token);
        if (normaltoken instanceof List_Token_1.default) {
            const normallisttoken = normaltoken;
            const newnormallisttoken = new List_Token_1.default();
            for (let i = 0; i < normallisttoken.tokens.length; i++) {
                let newsecuritytoken = new Security_Token_1.default();
                newsecuritytoken.issuercoinaddress = securitytoken.issuercoinaddress;
                newsecuritytoken.listcoinaddresses = securitytoken.listcoinaddresses;
                newsecuritytoken.asset = securitytoken.asset;
                newsecuritytoken.liability = securitytoken.liability;
                newsecuritytoken.token = normallisttoken.tokens[i];
                newsecuritytoken = this.NormalSecurityToken(newsecuritytoken);
                newnormallisttoken.tokens.push(newsecuritytoken);
            }
            return_value = newnormallisttoken;
        }
        else {
            if (normaltoken instanceof Security_Token_1.default) {
                const normalsecuritytoken = normaltoken;
                const newnormalsecuritytoken = new Security_Token_1.default();
                newnormalsecuritytoken.issuercoinaddress = normalsecuritytoken.issuercoinaddress;
                if (Except(securitytoken.listcoinaddresses.coinaddresses, normalsecuritytoken.listcoinaddresses.coinaddresses).length === 0) {
                    newnormalsecuritytoken.listcoinaddresses = securitytoken.listcoinaddresses; // Takes onward transfer restriction list of addresses from parent
                }
                else {
                    throw new Error("Security Token cannot add addresses allowable for onward transfer to those addresses given in child Security");
                }
                newnormalsecuritytoken.asset = normalsecuritytoken.asset;
                newnormalsecuritytoken.liability = normalsecuritytoken.liability;
                newnormalsecuritytoken.token = normalsecuritytoken.token;
                return_value = newnormalsecuritytoken;
            }
            else {
                const newnormalsecuritytoken = new Security_Token_1.default();
                newnormalsecuritytoken.issuercoinaddress = securitytoken.issuercoinaddress;
                newnormalsecuritytoken.listcoinaddresses = securitytoken.listcoinaddresses;
                newnormalsecuritytoken.asset = securitytoken.asset;
                newnormalsecuritytoken.liability = securitytoken.liability;
                newnormalsecuritytoken.token = normaltoken;
                return_value = newnormalsecuritytoken;
            }
        }
        return return_value;
    }
}
exports.TokenNormaliser = TokenNormaliser;
exports.default = TokenNormaliser;
function Except(arr1, arr2) {
    return arr1.filter((a1) => arr2.indexOf(a1) === -1);
}
exports.Except = Except;
