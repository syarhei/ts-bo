import {CONFIG, KEY} from "./inversify/identifiers/common";
import {IConfig, IKey} from "./IConfig";
import {injectable, inject} from "inversify";
import {default as Datastore, Sequelize} from "sequelize";

@injectable()
export class DBConnection {
    public connection: Sequelize = null;

    constructor(
        @inject(CONFIG) config: IConfig,
        @inject(KEY) key: IKey,
    ) {
        this.connection = new Datastore(config.DATABASE_NAME, config.DATABASE_USER, key.DATABASE_PASSWORD, {
            dialect: config.DATABASE_DIALECT,
            host: config.DATABASE_HOSTNAME
        });
    }
}