import {inject, injectable} from "inversify";
import {AUTH_SERVICE, CONFIG, PASSPORT, USER_DAL} from "../../inversify/identifiers/common";
import {Authenticator} from "passport";
import {User} from "../models/contracts/User";
import {UserDAL} from "../DAL/UserDAL";
import {UserError} from "../models/exceptions/UserError";
import {Strategy as LocalStrategy} from "passport-local";
import {AuthService} from "../services/AuthService";
import {UserForPassport} from "../models/contracts/user/UserForPassport";
import {IConfig} from "../../types/IConfig";

@injectable()
export class PassportHandler {
    constructor(
        @inject(PASSPORT) private passport: Authenticator,
        @inject(USER_DAL) private userDAL: UserDAL,
        @inject(AUTH_SERVICE) private authService: AuthService,
        @inject(CONFIG) private config: IConfig
    ) {}

    public serialize() {
        this.passport.serializeUser<UserForPassport, string>((user, done) => {
            done(null, user.id);
        });
    }

    public deserialize() {
        this.passport.deserializeUser<UserForPassport, string>(async (userId, done) => {
            const user: User = await this.userDAL.getUserById(userId);
            if (!user) {
                done(new UserError(`User is not found`, 1));
            }
            const userForPassport: UserForPassport = {
                id: user.id,
                nickname: user.nickname,
                role: user.role
            };
            done(null, userForPassport);
        });
    }

    public init() {
        this.passport.use(this.config.PASSPORT_STRATEGY_NAME, new LocalStrategy(async (nickame, password, done) => {
            try {
                const user: User = await this.authService.logIn(nickame, password);
                const userForPassport: UserForPassport = {
                    id: user.id,
                    nickname: user.nickname,
                    role: user.role
                };
                done(null, userForPassport);
            } catch (err) {
                done(err);
            }
        }));
    }
}