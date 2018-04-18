import {inject, injectable} from "inversify";
import {MatchService} from "../services/MatchService";
import {Router, Request, Response} from "express";
import {Match} from "../contracts/Match";
import {CoefficientService} from "../services/CoefficientService";
import {MaherPoissonService} from "../services/MaherPoissonService";
import {COEFFICIENT_SERVICE, MAHER_POISSON_SERVICE, MATCH_SERVICE} from "../../inversify/identifiers/common";

const MATCH_LIMIT_NUMBER: number = 40;

@injectable()
export class MatchController {
    constructor(
        @inject(MATCH_SERVICE) private matchService: MatchService,
        @inject(COEFFICIENT_SERVICE) private coefficientService: CoefficientService,
        @inject(MAHER_POISSON_SERVICE) private maherPoissonService: MaherPoissonService,
    ) {}

    get router(): Router {
        const router: Router = Router();

        router.post("/match/engine/maher-poisson", this.createMatchByMaherPoisson);
        router.post("/match/engine/bradley-terry", this.createMatchByBradleyTerry);
        // router.post("/match/expert-review", this.createMatch);

        return router;
    }

    private async createMatchByMaherPoisson(req: Request, res: Response): Promise<void> {
        const { teamHomeId, teamGuestId, matchCategoryId, date, place }: Match = req.body;

        const { attack: homeAttack, defence: homeDefence } =
            await this.matchService.getMatchesByTeam(teamHomeId, MATCH_LIMIT_NUMBER);
        const { attack: awayAttack, defence: awayDefence } =
            await this.matchService.getMatchesByTeam(teamGuestId, MATCH_LIMIT_NUMBER);

        let { win1, draw, win2 } = this.maherPoissonService
            .generateProbability(homeAttack, awayDefence, awayAttack, homeDefence);
        ({ win1, win2, draw } = this.coefficientService.getCoefficients(win1, draw, win2));

        const data: Match = {
            teamHomeId, teamGuestId, matchCategoryId, date, place,
            coefficientWin1: win1, coefficientDraw: draw, coefficientWin2: win2
        } as Match;
        const match = await this.matchService.createMatchWithCoefficients(data);

        res.status(201).json(match);
    }

    private async createMatchByBradleyTerry(req: Request, res: Response): Promise<void> {

    }
}