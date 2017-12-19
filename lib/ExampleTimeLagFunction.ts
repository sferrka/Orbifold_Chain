import ITimeFunction from "./ITimeFunction";
import User_Functions from "./User_Functions";
export class ExampleTimeFunction implements ITimeFunction {
    public TimeLagFunctionName = "ExampleTimeFunction";

    public TimeLagFunction(inputTime: Date) {
        const n = new User_Functions();

        const m = n.AddOneDayFunction(inputTime);

        return n.AddOneDayFunction(m);
    }
}
export default ExampleTimeFunction;
