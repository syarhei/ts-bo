import {convertSumToInteger} from "../../../utils/math";
import * as Assert from "assert";

describe("Math Utils", () => {
    it("Check Sum Conversion", () => {
        const sum: number = 1;
        let a: number = 4.1, b: number = 8.33, c: number = 9.05;
        ([a, b, c] = convertSumToInteger(sum, a, b, c));
        Assert.deepEqual(a + b + c, sum);
    });
});