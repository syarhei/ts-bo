import {Router, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {AUTH_HANDLER, AUTH_SERVICE, USER_SERVICE} from "../../inversify/identifiers/common";
import {AuthService} from "../services/AuthService";
import * as autoBind from "auto-bind";
import * as wrap from "express-async-wrap";
import {User} from "../models/contracts/User";
import {UserService} from "../services/UserService";
import {UserOptionsForCreate} from "../models/contracts/user/UserOptionsForCreate";
import {AuthHandler} from "../middlewares/AuthHandler";

@injectable()
export class UserController {
    constructor(
        @inject(AUTH_SERVICE) private authService: AuthService,
        @inject(USER_SERVICE) private userService: UserService,
        @inject(AUTH_HANDLER) private authHandler: AuthHandler
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();
        router.post("/users", wrap(this.createUser));
        router.get("/users/:userId", this.authHandler.checkUserPermissions, this.getUser);
        router.put("/users/:userId", this.authHandler.checkUserPermissions, wrap(this.updateUser));
        router.delete("/users/:userId", this.authHandler.adminAuth, wrap(this.updateUser));
        return router;
    }

    private async createUser(req: Request, res: Response): Promise<void> {
        const data: UserOptionsForCreate = req.body;
        const user: User = await this.authService.singUp(data);
        res.status(201).json(user);
    }

    private async getUser(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        const user: User = await this.userService.getUserById(userId);
        res.status(200).json(user);
    }

    private async updateUser(req: Request, res: Response): Promise<void> {
        res.status(204).end();
    }

    private async deleteUser(req: Request, res: Response): Promise<void> {
        const userId: string = req.params.userId;
        await this.userService.deleteUserById(userId);
        res.status(204).end();
    }
}