import {injectable} from "inversify";
import {NextFunction, Request, Response} from "express";
import {User} from "../models/contracts/User";
import {AuthError} from "../models/exceptions/AuthError";
import * as autoBind from "auto-bind";

const ADMIN_TYPE: string = "admin";
const USER_TYPE: string = "user";

@injectable()
export class AuthHandler {
    constructor() {
        autoBind(this);
    }

    public userAuth(req: Request, res: Response, next: NextFunction): void {
        this.middleware([USER_TYPE, ADMIN_TYPE], req, res, next);
    }

    public adminAuth(req: Request, res: Response, next: NextFunction): void {
        this.middleware([ADMIN_TYPE], req, res, next);
    }

    private middleware(roles: string[], req: Request, res: Response, next: NextFunction): void {
        const isAuth: boolean = req.isAuthenticated();
        if (isAuth) {
            if (roles.includes((req.user as User).role)) {
                next();
            } else {
                next(new AuthError(`Forbidden`, 2));
            }
        } else {
            next(new AuthError(`Unauthorized`, 1));
        }
    }
}