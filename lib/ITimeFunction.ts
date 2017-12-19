export default interface ITimeFunction {
    TimeLagFunctionName: string;
    TimeLagFunction(inputTime: Date): Date;
}
