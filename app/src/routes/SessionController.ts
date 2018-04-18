import {NextFunction, Request, Response, Router} from "express";
import {inject, injectable} from "inversify";
import * as autoBind from "auto-bind";
import {AUTH_HANDLER, CONFIG, KEY, PASSPORT} from "../../inversify/identifiers/common";
import * as wrap from "express-async-wrap";
import {Authenticator} from "passport";
import {AuthHandler} from "../middlewares/AuthHandler";
import {IConfig} from "../../types/IConfig";
import {IKey} from "../../types/IKey";

@injectable()
export class SessionController {
    private cookie: string = null;
    constructor(
        @inject(PASSPORT) private passport: Authenticator,
        @inject(AUTH_HANDLER) private auth: AuthHandler,
        @inject(CONFIG) private config: IConfig,
        @inject(KEY) keys: IKey
    ) {
        this.cookie = keys.EXPRESS_SESSION_COOKIE_NAME;
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();
        router.post(
            "/sessions", this.passport.authenticate(this.config.PASSPORT_STRATEGY_NAME), wrap(this.createSession)
        );
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
                res.clearCookie(this.cookie);
                res.status(200).end();
            }
        });
    }
}