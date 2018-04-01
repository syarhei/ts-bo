import "reflect-metadata";
import {Container} from "inversify";
import {
    APPLICATION, AUTH_SERVICE, BET_MODEL, CONFIG, DATABASE_CONNECTION, DATABASE_CONTEXT, KEY, MAIN_CONTROLLER,
    MATCH_CATEGORY_MODEL, MATCH_MODEL, TEAM_DAL, TEAM_MODEL,
    USER_CONTROLLER,
    USER_DAL, USER_MODEL
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

const environment: string = getConfigEnvironment();
const config: IConfig = require(`../../configs/${environment}/config.json`);
const key: IKey = require(`../../configs/${environment}/key.json`);

const container = new Container();

container.bind<IConfig>(CONFIG).toConstantValue(config);
container.bind<IKey>(KEY).toConstantValue(key);
container.bind<DBConnection>(DATABASE_CONNECTION).to(DBConnection).inSingletonScope();
container.bind<TeamModel>(TEAM_MODEL).to(TeamModel);
container.bind<MatchCategoryModel>(MATCH_CATEGORY_MODEL).to(MatchCategoryModel);
container.bind<MatchModel>(MATCH_MODEL).to(MatchModel);
container.bind<UserModel>(USER_MODEL).to(UserModel);
container.bind<BetModel>(BET_MODEL).to(BetModel);
container.bind<DBContext>(DATABASE_CONTEXT).to(DBContext).inSingletonScope();

container.bind<TeamDAL>(TEAM_DAL).to(TeamDAL);
container.bind<UserDAL>(USER_DAL).to(UserDAL);

container.bind<AuthService>(AUTH_SERVICE).to(AuthService);

container.bind<UserController>(USER_CONTROLLER).to(UserController);
container.bind<MainController>(MAIN_CONTROLLER).to(MainController);

container.bind<App>(APPLICATION).to(App).inSingletonScope();

export default container;