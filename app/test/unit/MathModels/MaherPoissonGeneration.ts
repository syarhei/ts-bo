import * as Assert from "assert";
import {MaherPoissonService} from "../../../src/services/MaherPoissonService";
import container from "../../../inversify/config";
import {MAHER_POISSON_SERVICE} from "../../../inversify/identifiers/common";

describe("Generation probabilities by Maher-Poisson Model", () => {
    let maherPoissonService: MaherPoissonService = null;
    let homeAttack: number = null;
    let homeDefence: number = null;
    let awayAttack: number = null;
    let awayDefence: number = null;

    before("Initialize input array", async () => {
        maherPoissonService = container.get<MaherPoissonService>(MAHER_POISSON_SERVICE);
        homeAttack = 3 + Math.random();
        homeDefence = 1 + Math.random();
        awayAttack = 1 + Math.random();
        awayDefence = 1 + Math.random();
    });

    it("Check probabilities", () => {
        const { win1, draw, win2 } = maherPoissonService
            .generateProbability(homeAttack, awayDefence, awayAttack, homeDefence);
        console.log(win1 + draw + win2 === 1);
        Assert.deepEqual(win1 + draw + win2, 1);
    });
});