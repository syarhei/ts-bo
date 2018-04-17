import {NextFunction, Request, Response, Router} from "express";
import {inject, injectable} from "inversify";
import * as autoBind from "auto-bind";
import {AUTH_HANDLER, PASSPORT} from "../../inversify/identifiers/common";
import * as wrap from "express-async-wrap";
import {Authenticator} from "passport";
import {EXPRESS_SESSION_COOKIE_NAME, PASSPORT_STRATEGY_NAME} from "../../types/common";
import {AuthHandler} from "../middlewares/AuthHandler";

@injectable()
export class SessionController {
    constructor(
        @inject(PASSPORT) private passport: Authenticator,
        @inject(AUTH_HANDLER) private auth: AuthHandler
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();
        router.post("/sessions", this.passport.authenticate(PASSPORT_STRATEGY_NAME), wrap(this.createSession));
        router.delete("/sessions", this.auth.userAuth, wrap(this.deleteSession));

        return router;
    }

    private async createSession(req: Request, res: Response): Promise<void> {
        res.status(200).end();
    }

    private async deleteSession(req: Request, res: Response, next: NextFunction): Promise<void> {
        req.logOut();
        (req.session as Express.Session).destroy((err) => {
            if (err) {
                next(err);
            } else {
                res.clearCookie(EXPRESS_SESSION_COOKIE_NAME);
                res.status(200).end();
            }
        });
    }
}