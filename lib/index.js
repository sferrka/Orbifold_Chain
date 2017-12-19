"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Base_Token_1 = require("./Base-Token");
const Coin_Address_1 = require("./Coin_Address");
const ExampleTimeLagFunction_1 = require("./ExampleTimeLagFunction");
const Function_Token_1 = require("./Function_Token");
const List_Amounts_Tokens_1 = require("./List_Amounts_Tokens");
const List_Token_1 = require("./List_Token");
const Option_Token_1 = require("./Option_Token");
const Security_Token_1 = require("./Security_Token");
const Serialization_Helper_1 = require("./Serialization-Helper");
const Token_1 = require("./Token");
const TokenNormaliser_1 = require("./TokenNormaliser");
const Console = {
    WriteLine: console.log.bind(console),
};
// Instance of ExampleTimeFunction
const exampletimelagfunction = new ExampleTimeLagFunction_1.ExampleTimeFunction();
// Sample showing exmaple time lag function changing a date.
const startdatetime = new Date(2018, 3, 27);
Console.WriteLine("The value of startdatetime before I called the example time function is ", startdatetime);
const newdatetime = exampletimelagfunction.TimeLagFunction(startdatetime);
Console.WriteLine("The value after I called the example time function is ", newdatetime);
// End code and sample
Console.WriteLine("");
// Example token constructions.
const my_coinaddress = new Coin_Address_1.Coin_Address();
my_coinaddress.coinaddress = "text of coin address";
const my_other_coinaddress = new Coin_Address_1.Coin_Address();
my_other_coinaddress.coinaddress = "text of another coin address";
const my_listcoinaddresses = new Coin_Address_1.List_Coin_Addresses();
my_listcoinaddresses.coinaddresses.push(my_coinaddress);
my_listcoinaddresses.coinaddresses.push(my_other_coinaddress);
my_listcoinaddresses.coinaddresses.push(my_coinaddress);
const my_token = new Base_Token_1.default();
my_token.coinaddress = my_coinaddress;
my_token.description = "an example token";
my_token.hash = "some hash";
const lt1 = new List_Token_1.default();
lt1.tokens.push(my_token);
const lt2 = new List_Token_1.default();
const tokens = [my_token, my_token, my_token, my_token];
lt2.tokens = lt2.tokens.concat(tokens);
const ft = new Function_Token_1.default();
ft.datetime = new Date(2016, 3, 25);
ft.token = lt2;
ft.TimeLagFunctionName = "Probably the hash of some code that defines the function";
ft.ValueFunctionName = "Also, probably hash of some code that defines the function";
const lt3 = new List_Token_1.default();
lt3.tokens.push(ft);
lt3.tokens.push(lt1);
const pair1 = new List_Amounts_Tokens_1.Amount_Token_Pair();
pair1.amount = 100;
pair1.token = my_token;
const pair2 = new List_Amounts_Tokens_1.Amount_Token_Pair();
pair2.amount = 200;
pair2.token = lt3;
const pair3 = new List_Amounts_Tokens_1.Amount_Token_Pair();
pair3.amount = 300;
pair3.token = lt2;
const mylats = new List_Amounts_Tokens_1.List_Amounts_Tokens();
mylats.listamountstokens.push(pair1);
mylats.listamountstokens.push(pair2);
mylats.listamountstokens.push(pair3);
Console.WriteLine("The amount on first entry on my list of amount and token pairs is: " + mylats.listamountstokens[0].amount);
Console.WriteLine("The amount on second entry on my list of amount and token pairs is: " + mylats.listamountstokens[1].amount);
Console.WriteLine("The amount on third entry on my list of amount and token pairs is: " + mylats.listamountstokens[2].amount);
const ot = new Option_Token_1.default();
ot.startdatetime = new Date(2018, 3, 27);
ot.enddatetime = new Date(2018, 3, 29);
ot.listamountstokens = mylats;
const st = new Security_Token_1.default();
st.issuercoinaddress = my_coinaddress;
st.listcoinaddresses = my_listcoinaddresses;
st.asset = false;
st.liability = true;
st.token = ot;
const n = new TokenNormaliser_1.default();
let nt = new Token_1.default();
let nnt = new Token_1.default();
nt = st;
Serialization_Helper_1.default.SerializeObject(nt, "beforenormalised.xml");
nnt = n.NormalToken(nt);
Serialization_Helper_1.default.SerializeObject(nnt, "normalised.xml");
// 'equals' has not been implemented on the Token class. The next line returns `false', but the XMLs are identical (when nt=st):
Console.WriteLine("normalised equals original? ", nnt === nt);
// Serialization and de-serialization examples.
const jsonserialized = JSON.stringify(lt1);
const jsonserialized3 = JSON.stringify(lt3);
Console.WriteLine("my JSON serialized object 1 is ", jsonserialized);
JSON.parse(jsonserialized);
fs_1.writeFileSync("Jsonmyserializedobject1.txt", jsonserialized);
fs_1.writeFileSync("Jsonmyserializedobject3.txt", jsonserialized3);
const newjsonstring = fs_1.readFileSync("Jsonmyserializedobject1.txt").toString();
const deserializedjson = JSON.parse(newjsonstring);
Console.WriteLine("my JSON serialized object 1 now looks like ", newjsonstring);
Console.WriteLine("How long is the deserialized JSON token object 1: " + deserializedjson.tokens.length);
Console.WriteLine("How long is the original token object 1: " + lt1.tokens.length);
Serialization_Helper_1.default.SerializeObject(lt1, "myserializedobject1.xml");
Serialization_Helper_1.default.SerializeObject(my_token, "mytoken.xml");
Serialization_Helper_1.default.SerializeObject(lt1, "myserializedobject1.xml");
Serialization_Helper_1.default.SerializeObject(lt2, "myserializedobject2.xml");
Serialization_Helper_1.default.SerializeObject(lt3, "myserializedobject3.xml");
Serialization_Helper_1.default.DeSerializeObject("myserializedobject3.xml", List_Token_1.default).then((newobj) => {
    Serialization_Helper_1.default.SerializeObject(ft, "myfunctiontoken.xml");
    Serialization_Helper_1.default.SerializeObject(ot, "optiontoken.xml");
    Serialization_Helper_1.default.SerializeObject(st, "securitytoken.xml");
    // Few final random examples.
    if (ft.token instanceof List_Token_1.default) {
        Console.WriteLine("What was defined in ft.Token at this was point is a List Token");
    }
    Console.WriteLine("How long is the deserialized token object 3: " + newobj.tokens.length);
    Console.WriteLine("Token address: " + my_token.coinaddress.coinaddress);
    Console.WriteLine("Token description: " + my_token.description);
    Console.WriteLine("Token hash: " + my_token.hash);
    Console.WriteLine("Press key to exit");
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", process.exit.bind(process, 0));
}).catch((e) => { throw e; });
