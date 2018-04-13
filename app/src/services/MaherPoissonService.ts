import {inject, injectable} from "inversify";
import {IConfig} from "../../IConfig";
import {CONFIG} from "../../inversify/identifiers/common";

type MaherPoissonEntity = { homeGoals: number; guestGoals: number; probability: number; };

@injectable()
export class MaherPoissonService {
    private readonly place: number = null;
    private readonly TABLE_SIZE: number = null;
    private maherPoissonTable: MaherPoissonEntity[] = [];

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
        const home: number = Math.log(this.place + homeAttack + awayDefence);
        const away: number = Math.log(awayAttack + homeDefence);

        for (let homeGoals: number = 0; homeGoals < this.TABLE_SIZE; homeGoals++) {
            for (let guestGoals: number = 0; guestGoals < this.TABLE_SIZE; guestGoals++) {
                const probability: number = this.calculateProbability(home, homeGoals, away, guestGoals);
                this.maherPoissonTable.push({ homeGoals, guestGoals, probability });
            }
        }

        let win1: number = this.maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals > guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);
        let draw: number = this.maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals === guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);
        let win2: number = this.maherPoissonTable
            .filter(({homeGoals, guestGoals}: MaherPoissonEntity) => homeGoals < guestGoals)
            .reduce<number>((memory: number, value) => memory + value.probability, 0);

        const sum = win1 + draw + win2;

        // Transform to valid probability (sum of 3 coefficients should be equal 1)
        win1 = win1 / sum;
        draw = draw / sum;
        win2 = win2 / sum;

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