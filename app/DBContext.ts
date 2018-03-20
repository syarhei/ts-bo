import {default as Datastore, default as sequelize, Sequelize} from "sequelize";
import {inject, injectable} from "inversify";
import {CONFIG, DATABASE_CONNECTION, KEY, USER_MODEL} from "./inversify/identifiers/common";
import {IConfig, IKey} from "./IConfig";
import {UserModel} from "./src/models/UserModel";
import {DBConnection} from "./DBConnection";
import {User} from "./src/models/contracts/User";

@injectable()
export class DBContext {
    constructor(
        @inject(USER_MODEL) private user: UserModel,
        @inject(DATABASE_CONNECTION) private dbConnection: DBConnection
    ) {}

    public get USER(): sequelize.Model<User, User> {
        return this.user.model;
    }

    public async init(): Promise<void> {
        await this.dbConnection.connection.sync();
    }
}