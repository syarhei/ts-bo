import {inject, injectable} from "inversify";
import {Router, Response, Request} from "express";
import * as autoBind from "auto-bind";
import {TeamOptionsForCreate} from "../models/contracts/team/TeamOptionsForCreate";
import {TeamService} from "../services/TeamService";
import {Team} from "../models/contracts/Team";
import {TeamError} from "../models/exceptions/TeamError";
import {TeamOptionsForUpdate} from "../models/contracts/team/TeamOptionsForUpdate";
import {AUTH_HANDLER, TEAM_SERVICE} from "../../inversify/identifiers/common";
import * as wrap from "express-async-wrap";
import {AuthHandler} from "../middlewares/AuthHandler";

@injectable()
export class TeamController {
    constructor(
        @inject(TEAM_SERVICE) private teamService: TeamService,
        @inject(AUTH_HANDLER) private authHandler: AuthHandler
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();

        router.post("/teams", this.authHandler.adminAuth, wrap(this.createTeam));
        router.get("/teams/:teamId", wrap(this.getTeam));
        router.put("/teams/:teamId", this.authHandler.adminAuth, wrap(this.updateTeam));
        router.delete("/teams/:teamId", this.authHandler.adminAuth, wrap(this.deleteTeam));

        return router;
    }

    private async createTeam(req: Request, res: Response): Promise<void> {
        const teamOptions: TeamOptionsForCreate = req.body;
        const team: Team = await this.teamService.createTeam(teamOptions);
        res.status(201).json(team);
    }

    private async getTeam(req: Request, res: Response): Promise<void> {
        const teamId: string = req.params.teamId;
        const team: Team = await this.teamService.getTeamById(teamId);
        res.status(200).json(team);
    }

    private async updateTeam(req: Request, res: Response): Promise<void> {
        const teamId: string = req.params.teamId;
        const teamOptions: TeamOptionsForUpdate = req.body;
        await this.teamService.updateTeamById(teamId, teamOptions);
        res.status(204).end();
    }

    private async deleteTeam(req: Request, res: Response): Promise<void> {
        const teamId: string = req.params.teamId;
        await this.teamService.deleteTeamById(teamId);
        res.status(204).end();
    }
}