import {inject, injectable} from "inversify";
import {AUTH_SERVICE, PASSPORT, USER_DAL} from "../../inversify/identifiers/common";
import {Authenticator} from "passport";
import {User} from "../models/contracts/User";
import {UserDAL} from "../DAL/UserDAL";
import {UserError} from "../models/exceptions/UserError";
import {Strategy as LocalStrategy} from "passport-local";
import {AuthService} from "../services/AuthService";
import {PASSPORT_STRATEGY_NAME} from "../../types/common";

@injectable()
export class PassportHandler {
    constructor(
        @inject(PASSPORT) private passport: Authenticator,
        @inject(USER_DAL) private userDAL: UserDAL,
        @inject(AUTH_SERVICE) private authService: AuthService
    ) {}

    public serialize() {
        this.passport.serializeUser<User, string>((user, done) => {
            done(null, user.id);
        });
    }

    public deserialize() {
        this.passport.deserializeUser<User, string>(async (userId, done) => {
            const user: User = await this.userDAL.getUserById(userId);
            if (!user) {
                done(new UserError(`User is not found`, 1));
            }
            done(null, user);
        });
    }

    public init() {
        this.passport.use(PASSPORT_STRATEGY_NAME, new LocalStrategy(async (nickame, password, done) => {
            try {
                const user = await this.authService.logIn(nickame, password);
                done(null, user);
            } catch (err) {
                done(err);
            }
        }));
    }
}