import { Coin_Address, List_Coin_Addresses } from "./Coin_Address";
import Token from "./Token";
export class Security_Token extends Token {
    // Issuer address
    public issuercoinaddress: Coin_Address;
    // Addresses acceptable for onward transfer
    public listcoinaddresses: List_Coin_Addresses;
    // Strictly asset flag
    public asset: boolean = false;
    // Strictly liability flag
    public liability: boolean = false;
    /// Underlying token
    public token: Token;
}
export default Security_Token;
