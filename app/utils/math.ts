
export function convertSumToInteger (target: number, ...args: number[]): number[] {
    let counter: number = 0;
    let sum: number = args.reduce((memory: number, value: number) => memory + value, 0);
    while (sum !== target) {
        args = args.map(value => value / sum);
        sum = args.reduce((memory: number, value: number) => memory + value, 0);
        counter++;
    }
    return args;
}