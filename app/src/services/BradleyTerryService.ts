import {injectable} from "inversify";
import {convertSumToInteger} from "../../utils/math";

@injectable()
export class BradleyTerryService {
    constructor() {}

    public generateProbabilities(
        point1: number, point2: number, drawProb1: number = 1, drawProb2: number = 1, homeAdvantage: number = 0.5
    ) {
        homeAdvantage = homeAdvantage * 2;
        let win1: number = homeAdvantage * point1 / (homeAdvantage * point1 + point2);
        const numeratorOfDraw: number = 2 * Math.sqrt(drawProb1 * drawProb2 * homeAdvantage * point1 * point2);
        let draw: number = numeratorOfDraw / (homeAdvantage * point1 + point2 + numeratorOfDraw);
        let win2: number = point2 / (homeAdvantage * point1 + point2);

        ([win1, draw, win2] = convertSumToInteger(1, win1, draw, win2));

        return { win1, draw, win2 };
    }
}