import Token from "./Token";
export class Function_Token extends Token {
    public amount: number = 0;
    /// A timestamp
    public datetime: Date;
    /// Underlying Token
    public token: Token;
    /// The identifier string of a value function
    public ValueFunctionName: string = "";
    /// The identifier string of a value function
    public TimeLagFunctionName: string = "";
}
export default Function_Token;
