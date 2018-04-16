import "reflect-metadata";
import {Container} from "inversify";
import {
    APPLICATION, PASSPORT_HANDLER, AUTH_SERVICE, BET_MODEL, COEFFICIENT_SERVICE, CONFIG, DATABASE_CONNECTION,
    DATABASE_CONTEXT, KEY, MAHER_POISSON_SERVICE, MAIN_CONTROLLER, MATCH_CATEGORY_DAL, MATCH_CATEGORY_MODEL,
    MATCH_CONTROLLER, MATCH_DAL, MATCH_MODEL, MATCH_SERVICE, PASSPORT, SESSION_CONTROLLER, TEAM_CONTROLLER, TEAM_DAL,
    TEAM_MODEL, TEAM_SERVICE, USER_CONTROLLER, USER_DAL, AUTH_HANDLER, USER_MODEL, USER_SERVICE
} from "./identifiers/common";
import {IConfig, IKey} from "../IConfig";
import {DBContext} from "../DBContext";
import {UserModel} from "../src/models/UserModel";
import {DBConnection} from "../DBConnection";
import {App} from "../App";
import {UserController} from "../src/routes/UserController";
import {MainController} from "../src/routes/MainController";
import {UserDAL} from "../src/DAL/UserDAL";
import {AuthService} from "../src/services/AuthService";
import {getConfigEnvironment} from "./utils/env";
import {TeamModel} from "../src/models/TeamModel";
import {MatchCategoryModel} from "../src/models/MatchCategoryModel";
import {MatchModel} from "../src/models/MatchModel";
import {BetModel} from "../src/models/BetModel";
import {TeamDAL} from "../src/DAL/TeamDAL";
import {MatchCategoryDAL} from "../src/DAL/MatchCategoryDAL";
import {MatchService} from "../src/services/MatchService";
import {CoefficientService} from "../src/services/CoefficientService";
import {MaherPoissonService} from "../src/services/MaherPoissonService";
import {MatchController} from "../src/routes/MatchController";
import {MatchDAL} from "../src/DAL/MatchDAL";
import {TeamService} from "../src/services/TeamService";
import {TeamController} from "../src/routes/TeamController";
import * as passport from "passport";
import {PassportHandler} from "../src/middlewares/PassportHandler";
import {SessionController} from "../src/routes/SessionController";
import {AuthHandler} from "../src/middlewares/AuthHandler";
import {UserService} from "../src/services/UserService";

const environment: string = getConfigEnvironment();
const config: IConfig = require(`../../configs/${environment}/config.json`);
const key: IKey = require(`../../configs/${environment}/key.json`);

const container = new Container();

container.bind<IConfig>(CONFIG).toConstantValue(config);
container.bind<IKey>(KEY).toConstantValue(key);
container.bind<DBConnection>(DATABASE_CONNECTION).to(DBConnection).inSingletonScope();
container.bind<passport.Authenticator>(PASSPORT).toConstantValue(new passport.Passport());
container.bind<TeamModel>(TEAM_MODEL).to(TeamModel);
container.bind<MatchCategoryModel>(MATCH_CATEGORY_MODEL).to(MatchCategoryModel);
container.bind<MatchModel>(MATCH_MODEL).to(MatchModel);
container.bind<UserModel>(USER_MODEL).to(UserModel);
container.bind<BetModel>(BET_MODEL).to(BetModel);
container.bind<DBContext>(DATABASE_CONTEXT).to(DBContext).inSingletonScope();

container.bind<TeamDAL>(TEAM_DAL).to(TeamDAL);
container.bind<MatchCategoryDAL>(MATCH_CATEGORY_DAL).to(MatchCategoryDAL);
container.bind<MatchDAL>(MATCH_DAL).to(MatchDAL);
container.bind<UserDAL>(USER_DAL).to(UserDAL);

container.bind<AuthService>(AUTH_SERVICE).to(AuthService);
container.bind<UserService>(USER_SERVICE).to(UserService);
container.bind<TeamService>(TEAM_SERVICE).to(TeamService);
container.bind<MatchService>(MATCH_SERVICE).to(MatchService);
container.bind<MaherPoissonService>(MAHER_POISSON_SERVICE).to(MaherPoissonService);
container.bind<CoefficientService>(COEFFICIENT_SERVICE).to(CoefficientService);

container.bind<TeamController>(TEAM_CONTROLLER).to(TeamController);
container.bind<MatchController>(MATCH_CONTROLLER).to(MatchController);
container.bind<UserController>(USER_CONTROLLER).to(UserController);
container.bind<SessionController>(SESSION_CONTROLLER).to(SessionController);
container.bind<MainController>(MAIN_CONTROLLER).to(MainController);

container.bind<PassportHandler>(PASSPORT_HANDLER).to(PassportHandler);
container.bind<AuthHandler>(AUTH_HANDLER).to(AuthHandler);
container.bind<App>(APPLICATION).to(App).inSingletonScope();

export default container;