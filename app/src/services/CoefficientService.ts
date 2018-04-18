import {inject, injectable} from "inversify";
import {CONFIG} from "../../inversify/identifiers/common";
import {IConfig} from '../../types/IConfig';
import {MatchError} from "../exceptions/MatchError";

@injectable()
export class CoefficientService {
    private margin: number = null;
    constructor(@inject(CONFIG) { APPLICATION_BET_PROFIT }: IConfig) {
        this.margin = APPLICATION_BET_PROFIT;
    }

    /**
     * Provide 3 percent numbers (0%-100%)
     * Return coefficients of each result
     * @param {number} win1
     * @param {number} draw
     * @param {number} win2
     */
    public getCoefficients(win1: number, draw: number, win2: number): { win1: number, draw: number, win2: number } {
        if (win1 + draw + win2 !== 1) {
            throw new MatchError(`Sum of this percents are not equal to '100'`, 2);
        }

        win1 = (1 + this.margin) * win1;
        draw = (1 + this.margin) * draw;
        win2 = (1 + this.margin) * win2;

        win1 = 1 / win1;
        draw = 1 / draw;
        win2 = 1 / win2;

        return { win1, draw, win2 };
    }
}