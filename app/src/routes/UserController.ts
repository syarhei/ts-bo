import {Router, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {AUTH_SERVICE} from "../../inversify/identifiers/common";
import {AuthService} from "../services/AuthService";
import {UserError} from "../models/exceptions/UserError";

@injectable()
export class UserController {
    constructor(
        @inject(AUTH_SERVICE) private authService: AuthService
    ) {}

    public get router(): Router {
        const router = Router();
        router.post("/user", this.createUser);
        return router;
    }

    protected async createUser(req: Request, res: Response): Promise<void> {
        try {
            const {nickname, password, email} = req.body;
            const user = await this.authService.singUp(nickname, email, password);
            res.status(200).json(user);
        } catch (err) {
            if (err instanceof UserError) {
                const code: number = 400 + err.statusCode;
                res.status(code).json(err.message);
            } else {
                res.status(500).end();
            }
        }
    }
}