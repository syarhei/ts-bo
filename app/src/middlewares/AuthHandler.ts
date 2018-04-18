import {injectable} from "inversify";
import {NextFunction, Request, Response} from "express";
import {AuthError} from "../exceptions/AuthError";
import * as autoBind from "auto-bind";
import {UserForPassport} from "../contracts/user/UserForPassport";

export const ADMIN_ROLE_NAME: string = "admin";
export const USER_ROLE_NAME: string = "user";

@injectable()
export class AuthHandler {
    constructor() {
        autoBind(this);
    }

    public checkUserPermissions(req: Request, res: Response, next: NextFunction): void {
        const userId: string = req.params.userId;
        const user: UserForPassport = req.user as UserForPassport;
        if (user.role === ADMIN_ROLE_NAME || userId !== user.id) {
            next(new AuthError(`You don't have any permissions`, 2));
        }
    }

    public userAuth(req: Request, res: Response, next: NextFunction): void {
        this.middleware([USER_ROLE_NAME, ADMIN_ROLE_NAME], req, res, next);
    }

    public adminAuth(req: Request, res: Response, next: NextFunction): void {
        this.middleware([ADMIN_ROLE_NAME], req, res, next);
    }

    private middleware(roles: string[], req: Request, res: Response, next: NextFunction): void {
        const isAuth: boolean = req.isAuthenticated();
        if (isAuth) {
            if (roles.includes((req.user as UserForPassport).role)) {
                next();
            } else {
                next(new AuthError(`Forbidden`, 2));
            }
        } else {
            next(new AuthError(`Unauthorized`, 1));
        }
    }
}