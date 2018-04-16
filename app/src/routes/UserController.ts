import {Router, Request, Response, NextFunction} from "express";
import {inject, injectable} from "inversify";
import {AUTH_SERVICE, USER_SERVICE} from "../../inversify/identifiers/common";
import {AuthService} from "../services/AuthService";
import * as autoBind from "auto-bind";
import * as wrap from "express-async-wrap";
import {User} from "../models/contracts/User";
import {UserService} from "../services/UserService";

@injectable()
export class UserController {
    constructor(
        @inject(AUTH_SERVICE) private authService: AuthService,
        @inject(USER_SERVICE) private userService: UserService,
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();
        router.post("/users", wrap(this.createUser));
        router.get("/users/:userId", this.getUser);
        router.put("/users/:userId", wrap(this.updateUser));
        return router;
    }

    private async createUser(req: Request, res: Response): Promise<void> {
        const data: User = req.body;
        const user: User = await this.authService.singUp(data);
        res.status(201).json(user);
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        const user: User = await this.userService.getUserById(userId);
        res.status(200).json(user);
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        if ((req.user as User).id !== userId) {
            res.status(403).json({ message: `You doesn't have any permissions to this user` });
        } else {
            res.status(204).end();
        }
    }
}