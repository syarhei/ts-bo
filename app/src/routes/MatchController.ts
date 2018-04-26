import {inject, injectable} from "inversify";
import {MatchService} from "../services/MatchService";
import {Router, Request, Response} from "express";
import {Match} from "../contracts/Match";
import {CoefficientService} from "../services/CoefficientService";
import {MaherPoissonService} from "../services/MaherPoissonService";
import {
    BRADLEY_TERRY_SERVICE, COEFFICIENT_SERVICE, MAHER_POISSON_SERVICE,
    MATCH_SERVICE
} from "../../inversify/identifiers/common";
import * as wrap from "express-async-wrap";
import * as autoBind from "auto-bind";
import {BradleyTerryService} from "../services/BradleyTerryService";

const MATCH_LIMIT_NUMBER: number = 40;

@injectable()
export class MatchController {
    constructor(
        @inject(MATCH_SERVICE) private matchService: MatchService,
        @inject(COEFFICIENT_SERVICE) private coefficientService: CoefficientService,
        @inject(MAHER_POISSON_SERVICE) private maherPoissonService: MaherPoissonService,
        @inject(BRADLEY_TERRY_SERVICE) private bradleyTerryService: BradleyTerryService
    ) {
        autoBind(this);
    }

    set router(router: Router) {}

    get router(): Router {
        const router: Router = Router();

        router.post("/matches/engine/maher-poisson", wrap(this.createMatchByMaherPoisson));
        router.post("/matches/engine/bradley-terry", wrap(this.createMatchByBradleyTerry));
        // router.post("/match/expert-review", this.createMatch);

        return router;
    }

    private async createMatchByMaherPoisson(req: Request, res: Response): Promise<void> {
        const { teamHomeId, teamGuestId, matchCategoryId, date, place }: Match = req.body as Match;

        const { attack: homeAttack, defence: homeDefence } =
            await this.matchService.getTeamAbilities(teamHomeId, MATCH_LIMIT_NUMBER);
        const { attack: awayAttack, defence: awayDefence } =
            await this.matchService.getTeamAbilities(teamGuestId, MATCH_LIMIT_NUMBER);

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
        const { teamHomeId, teamGuestId, matchCategoryId, date, place }: Match = req.body as Match;

        const [matchesWithHomeTeam, matchesWithGuestTeam] = await Promise.all<Match[], Match[]>([
            this.matchService.getMatchesByTeamId(teamHomeId, MATCH_LIMIT_NUMBER),
            this.matchService.getMatchesByTeamId(teamGuestId, MATCH_LIMIT_NUMBER)
        ]);

        const point1: number = this.matchService.getTeamPoints(teamHomeId, matchesWithHomeTeam);
        const point2: number = this.matchService.getTeamPoints(teamGuestId, matchesWithGuestTeam);
        const drawProb1: number = this.matchService.getDrawProbability(matchesWithHomeTeam);
        const drawProb2: number = this.matchService.getDrawProbability(matchesWithGuestTeam);
        const homeAdvantage: number = this.matchService.getHomeAbility(teamHomeId, matchesWithHomeTeam);

        let { win1, draw, win2 } = this.bradleyTerryService
            .generateProbabilities(point1, point2);
        ({ win1, win2, draw } = this.coefficientService.getCoefficients(win1, draw, win2));

        const data: Match = {
            teamHomeId, teamGuestId, matchCategoryId, date, place,
            coefficientWin1: win1, coefficientDraw: draw, coefficientWin2: win2
        } as Match;
        const match = await this.matchService.createMatchWithCoefficients(data);

        res.status(201).json(match);
    }
}