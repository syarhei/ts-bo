import {Router, Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class UserController {
    constructor() {}

    public get router(): Router {
        const router = Router();

        router.post("/signup", this.signUp);
        router.post("/login", this.login);

        return router;
    }

    private async signUp(req: Request, res: Response) {
        const {nickname, password, email} = req.body;

        res.status(200).end();
    }

    private async login(req: Request, res: Response) {
        const {nickname, password} = req.body;

        res.status(200).end();
    }
}