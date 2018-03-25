import {Router, Request, Response, NextFunction} from "express";
import {inject, injectable} from "inversify";
import {AUTH_SERVICE} from "../../inversify/identifiers/common";
import {AuthService} from "../services/AuthService";
import * as autoBind from "auto-bind";
import * as wrap from "express-async-wrap";

@injectable()
export class UserController {
    constructor(
        @inject(AUTH_SERVICE) private authService: AuthService
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();
        router.post("/user", wrap(this.createUser));
        return router;
    }

    private async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const {nickname, password, email} = req.body;
        const user = await this.authService.singUp(nickname, email, password);
        res.status(200).json(user);
    }
}