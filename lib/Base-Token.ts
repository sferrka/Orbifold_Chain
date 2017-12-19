import { Coin_Address } from "./Coin_Address";
import Token from "./Token";
export class Base_Token extends Token {
    public coinaddress: Coin_Address;    // Base token issuer address
    public description = "";    // Description e.g. ''Pay bearer one USD''
    public hash = ""; // Hash of legal text defining Token.
}
export default Base_Token;
