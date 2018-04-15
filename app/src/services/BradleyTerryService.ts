import {injectable} from "inversify";

enum MatchResult {
    WIN = 1, DRAW = 0.5, LOSE = 0
}

@injectable()
export class BradleyTerryService {
    private readonly B: number = Math.log(2) / 100;
    constructor() {}

    public getRating(oldRating: number, K: number, result: MatchResult, difference: number): number {
        const power: number = ( difference / 400 ) + 1;
        const expectedResult: number = 1 / ( Math.pow(10, power));
        return oldRating + K * ( result - expectedResult );
    }

    public getStartingRating(oldRating: number, wins: number, loses: number, games: number): number {
        return oldRating + ( 400 * (wins - loses) / games );
    }

    public generateProbability() {

    }

    private getProbability(homeAdvantage: number, ratingHome: number, ratingAway: number): number {
        const exp: number = Math.exp(homeAdvantage + this.B * (ratingHome - ratingAway));
        return exp / (1 + exp);
    }
}