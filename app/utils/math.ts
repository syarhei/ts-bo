import * as _ from "underscore";

export function convertSumToInteger (target: number, ...args: number[]): number[] {
    let counter: number = 0;
    let sum: number = args.reduce((memory: number, value: number) => memory + value, 0);
    while (sum !== target && counter < 100) {
        args = args.map(value => value / sum);
        sum = args.reduce((memory: number, value: number) => memory + value, 0);
        counter++;
    }
    if (sum !== target) {
        const difference: number = target - sum;
        const maxValue: number = _.max(args);
        const indexOfMaxValue: number = _.indexOf(args, maxValue);
        if (indexOfMaxValue !== -1) {
            args[indexOfMaxValue] += difference;
        }
    }
    return args;
}