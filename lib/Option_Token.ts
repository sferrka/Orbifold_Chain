import { List_Amounts_Tokens } from "./List_Amounts_Tokens";
import Token from "./Token";
export class Option_Token extends Token {
    /// Start timestamp
    public startdatetime: Date;
    /// End timestamp
    public enddatetime: Date;
    /// List of amounts and Tokens
    public listamountstokens: List_Amounts_Tokens;
}
export default Option_Token;
