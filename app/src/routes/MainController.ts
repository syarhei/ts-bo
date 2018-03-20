import {Router} from "express";
import {injectable, inject} from "inversify";
import {USER_CONTROLLER} from "../../inversify/identifiers/common";
import {UserController} from "./UserController";

@injectable()
export class MainController {
    constructor(
        @inject(USER_CONTROLLER) private userController: UserController
    ) {}

    public get router(): Router {
        const router = Router();

        router.use(this.userController.router);

        return router;
    }
}