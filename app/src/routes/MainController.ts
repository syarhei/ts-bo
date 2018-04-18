import {Router} from "express";
import {injectable, inject} from "inversify";
import {
    MATCH_CATEGORY_CONTROLLER, MATCH_CONTROLLER, SESSION_CONTROLLER, TEAM_CONTROLLER, USER_CONTROLLER
} from "../../inversify/identifiers/common";
import {UserController} from "./UserController";
import {MatchController} from "./MatchController";
import {TeamController} from "./TeamController";
import {SessionController} from "./SessionController";
import {MatchCategoryController} from "./MatchCategoryController";

@injectable()
export class MainController {
    constructor(
        @inject(SESSION_CONTROLLER) private sessionController: SessionController,
        @inject(USER_CONTROLLER) private userController: UserController,
        @inject(TEAM_CONTROLLER) private teamController: TeamController,
        @inject(MATCH_CONTROLLER) private matchController: MatchController,
        @inject(MATCH_CATEGORY_CONTROLLER) private matchCategoryController: MatchCategoryController,
    ) {}

    public get router(): Router {
        const router = Router();

        router.use(this.sessionController.router);
        router.use(this.userController.router);
        router.use(this.teamController.router);
        router.use(this.matchCategoryController.router);
        router.use(this.matchController.router);

        return router;
    }
}