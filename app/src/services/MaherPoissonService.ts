import {inject, injectable} from "inversify";
import {IConfig} from "../../types/IConfig";
import {CONFIG} from "../../inversify/identifiers/common";
import {convertSumToInteger} from "../../utils/math";

type MaherPoissonEntity = { homeGoals: number; guestGoals: number; probability: number; };

@injectable()
export class MaherPoissonService {
    private readonly place: number = null;
    private readonly TABLE_SIZE: number = null;

    constructor(@inject(CONFIG) private config: IConfig) {
        this.place = config.MAHER_POISSON_HOME_PLACE_COEFFICIENT;
        this.TABLE_SIZE = config.MAHER_POISSON_TABLE_SIZE;
    }

    /**
     * Generate probability by Maher-Poisson Model
     * @param {number} homeAttack
     * @param {number} awayDefence
     * @param {number} awayAttack
     * @param {number} homeDefence
     * @returns {{win1: number, draw: number, win2: number}}
     */
    public generateProbability(
        homeAttack: number, awayDefence: number, awayAttack: number, homeDefence: number
    ): { win1: number, draw: number, win2: number } {
        const maherPoissonTable: MaherPoissonEntity[] = [];
        const home: number = Math.log(this.place + homeAttack + awayDefence);
        const away: number = Math.log(awayAttack + homeDefence);

        for (let homeGoals: number = 0; homeGoals < this.TABLE_SIZE; homeGoals++) {
            for (let guestGoals: number = 0; guestGoals < this.TABLE_SIZE; guestGoals++) {
                const probability: number = this.calculateProbability(home, homeGoals, away, guestGoals);
                maherPoissonTable.push({ homeGoals, guestGoals, probability });
            }
        }

        let win1: number = maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals > guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);
        let draw: number = maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals === guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);
        let win2: number = maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals < guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);

        ([win1, draw, win2] = convertSumToInteger(1, win1, draw, win2));

        return { win1, draw, win2 };
    }

    private calculateProbability(home: number, homeGoals: number, away: number, awayGoals: number): number {
        return ((Math.pow(Math.E, -home) * Math.pow(home, homeGoals)) / this.getFactorial(homeGoals)) *
            ((Math.pow(Math.E, -away) * Math.pow(away, awayGoals)) / this.getFactorial(awayGoals));
    }

    // TODO: replace using library (npm)
    private getFactorial(value: number): number {
        return value ? value * this.getFactorial(value - 1) : 1;
    }
}