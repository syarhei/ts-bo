import {Router} from "express";
import {injectable, inject} from "inversify";
import {MATCH_CONTROLLER, TEAM_CONTROLLER, USER_CONTROLLER} from "../../inversify/identifiers/common";
import {UserController} from "./UserController";
import {MatchController} from "./MatchController";
import {TeamController} from "./TeamController";

@injectable()
export class MainController {
    constructor(
        @inject(USER_CONTROLLER) private userController: UserController,
        @inject(TEAM_CONTROLLER) private teamController: TeamController,
        @inject(MATCH_CONTROLLER) private matchController: MatchController,
    ) {}

    public get router(): Router {
        const router = Router();

        router.use(this.userController.router);
        router.use(this.teamController.router);
        router.use(this.matchController.router);

        return router;
    }
}