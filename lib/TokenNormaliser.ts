import Base_Token from "./Base-Token";
import Function_Token from "./Function_Token";
import List_Token from "./List_Token";
import Option_Token from "./Option_Token";
import Security_Token from "./Security_Token";
import Token from "./Token";
// NormalToken: Takes a token and (i) puts any list component to the front and (ii) collapses any multiple security token (security token whose
// underlying token is a security token, etc) into a single security token. Done recursively so that the underlying token(s)
// of any normalised Token is either a base Token, Function Token, Option Token or Security Token. Returns a Token or Null.
// NormalListToken etc: applies to specific Token clases (e.g. List_Token) as part of the recursive definition of NormalToken.
export class TokenNormaliser {

    public NormalToken(token: Token): Token {
        let return_value: Token | null = null;

        if (token instanceof Base_Token) {
            return_value = token;
        }
        if (token instanceof List_Token) {
            return_value = this.NormalListToken(token as List_Token);
        }
        if (token instanceof Function_Token) {
            return_value = this.NormalFunctionToken(token as Function_Token);
        }
        if (token instanceof Option_Token) {
            return_value = token;
        }
        if (token instanceof Security_Token) {
            return_value = this.NormalSecurityToken(token as Security_Token);
        }

        if (return_value === null) {
            throw new Error("In method NormalToken, unrecognised token type");
        }
        return return_value;
    }
    public NormalListToken(listtoken: List_Token): List_Token {
        const newnormallisttoken = new List_Token();
        for (let i = 0; i < listtoken.tokens.length; i++) {
            const normaltoken = this.NormalToken(listtoken.tokens[i]);
            if (normaltoken instanceof List_Token) {
                const normallisttoken = normaltoken as List_Token;
                for (let j = 0; j < normallisttoken.tokens.length; j++) {
                    newnormallisttoken.tokens.push(normallisttoken.tokens[j]);
                }
            } else {
                newnormallisttoken.tokens.push(normaltoken);
            }
        }
        const return_value = newnormallisttoken;
        return return_value;
    }
    public NormalFunctionToken(functiontoken: Function_Token): Token {
        let return_value: Token | null = null;
        const normaltoken = this.NormalToken(functiontoken.token);
        if (normaltoken instanceof List_Token) {
            const normallisttoken = normaltoken as List_Token;
            const newnormallisttoken = new List_Token();
            for (let i = 0; i < normallisttoken.tokens.length; i++) {
                const newfunctiontoken = new Function_Token();
                newfunctiontoken.amount = functiontoken.amount;
                newfunctiontoken.datetime = functiontoken.datetime;
                newfunctiontoken.token = normallisttoken.tokens[i];
                newfunctiontoken.ValueFunctionName = functiontoken.ValueFunctionName;
                newfunctiontoken.TimeLagFunctionName = functiontoken.TimeLagFunctionName;
                newnormallisttoken.tokens.push(newfunctiontoken);
            }
            return_value = newnormallisttoken;
        } else {
            const newfunctiontoken = new Function_Token();
            newfunctiontoken.amount = functiontoken.amount;
            newfunctiontoken.datetime = functiontoken.datetime;
            newfunctiontoken.token = normaltoken;
            newfunctiontoken.ValueFunctionName = functiontoken.ValueFunctionName;
            newfunctiontoken.TimeLagFunctionName = functiontoken.TimeLagFunctionName;
            return_value = newfunctiontoken;
        }

        return return_value;
    }
    public NormalSecurityToken(securitytoken: Security_Token): Token {
        let return_value: Token | null = null;
        const normaltoken = this.NormalToken(securitytoken.token);
        if (normaltoken instanceof List_Token) {
            const normallisttoken = normaltoken as List_Token;
            const newnormallisttoken = new List_Token();
            for (let i = 0; i < normallisttoken.tokens.length; i++) {
                let newsecuritytoken = new Security_Token();
                newsecuritytoken.issuercoinaddress = securitytoken.issuercoinaddress;
                newsecuritytoken.listcoinaddresses = securitytoken.listcoinaddresses;
                newsecuritytoken.asset = securitytoken.asset;
                newsecuritytoken.liability = securitytoken.liability;
                newsecuritytoken.token = normallisttoken.tokens[i];
                newsecuritytoken = this.NormalSecurityToken(newsecuritytoken) as Security_Token;
                newnormallisttoken.tokens.push(newsecuritytoken);
            }
            return_value = newnormallisttoken;
        } else {
            if (normaltoken instanceof Security_Token) {
                const normalsecuritytoken = normaltoken as Security_Token;
                const newnormalsecuritytoken = new Security_Token();
                newnormalsecuritytoken.issuercoinaddress = normalsecuritytoken.issuercoinaddress;
                if (Except(securitytoken.listcoinaddresses.coinaddresses,
                    normalsecuritytoken.listcoinaddresses.coinaddresses).length === 0) {
                    newnormalsecuritytoken.listcoinaddresses = securitytoken.listcoinaddresses;    // Takes onward transfer restriction list of addresses from parent
                } else {
                    throw new Error("Security Token cannot add addresses allowable for onward transfer to those addresses given in child Security");
                }

                newnormalsecuritytoken.asset = normalsecuritytoken.asset;
                newnormalsecuritytoken.liability = normalsecuritytoken.liability;
                newnormalsecuritytoken.token = normalsecuritytoken.token;

                return_value = newnormalsecuritytoken;
            } else {
                const newnormalsecuritytoken = new Security_Token();
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
export default TokenNormaliser;

export function Except(arr1: any[], arr2: any[]) {
    return arr1.filter((a1) => arr2.indexOf(a1) === -1);
}
