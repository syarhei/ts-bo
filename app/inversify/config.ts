import "reflect-metadata";
import {Container} from "inversify";
import {
    APPLICATION, AUTH_SERVICE, CONFIG, DATABASE_CONNECTION, DATABASE_CONTEXT, KEY, MAIN_CONTROLLER, USER_CONTROLLER,
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

const ENV: string = process.env.NODE_ENV === "production" ? "master" : "local";
const config: IConfig = require(`../../configs/${ENV}/config.json`);
const key: IKey = require(`../../configs/${ENV}/key.json`);

const container = new Container();

container.bind<IConfig>(CONFIG).toConstantValue(config);
container.bind<IKey>(KEY).toConstantValue(key);
container.bind<DBConnection>(DATABASE_CONNECTION).to(DBConnection).inSingletonScope();
container.bind<UserModel>(USER_MODEL).to(UserModel);
container.bind<DBContext>(DATABASE_CONTEXT).to(DBContext).inSingletonScope();

container.bind<UserDAL>(USER_DAL).to(UserDAL);

container.bind<AuthService>(AUTH_SERVICE).to(AuthService);

container.bind<UserController>(USER_CONTROLLER).to(UserController);
container.bind<MainController>(MAIN_CONTROLLER).to(MainController);

container.bind<App>(APPLICATION).to(App).inSingletonScope();

export default container;