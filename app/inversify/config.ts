import "reflect-metadata";

import {Container} from "inversify";
import {APPLICATION, CONFIG, DATABASE_CONNECTION, DATABASE_CONTEXT, KEY, USER_MODEL} from "./identifiers/common";
import {IConfig, IKey} from "../IConfig";
import {DBContext} from "../DBContext";
import {UserModel} from "../src/models/User";
import {DBConnection} from "../DBConnection";
import {App} from "../App";

const ENV: string = process.env.NODE_ENV === "production" ? "master" : "local";
const config: IConfig = require(`../../configs/${ENV}/config.json`);
const key: IKey = require(`../../configs/${ENV}/key.json`);

const container = new Container();

container.bind<IConfig>(CONFIG).toConstantValue(config);
container.bind<IKey>(KEY).toConstantValue(key);
container.bind<DBConnection>(DATABASE_CONNECTION).to(DBConnection).inSingletonScope();
container.bind<UserModel>(USER_MODEL).to(UserModel);
container.bind<DBContext>(DATABASE_CONTEXT).to(DBContext).inSingletonScope();

container.bind<App>(APPLICATION).to(App).inSingletonScope();

export default container;