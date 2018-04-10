import {Router} from "express";
import {injectable, inject} from "inversify";
import {USER_CONTROLLER} from "../../inversify/identifiers/common";
import {UserController} from "./UserController";
import {MatchController} from "./MatchController";

@injectable()
export class MainController {
    constructor(
        @inject(USER_CONTROLLER) private userController: UserController,
        @inject("") private matchController: MatchController,
    ) {}

    public get router(): Router {
        const router = Router();

        router.use(this.userController.router);
        router.use(this.matchController.router);

        return router;
    }
}