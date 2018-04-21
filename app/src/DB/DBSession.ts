import {inject, injectable} from "inversify";
import {CONFIG, KEY} from "../../inversify/identifiers/common";
import {IConfig} from "../../types/IConfig";
import * as session from "express-session";
import {RequestHandler} from "express";
import {MemoryStore, SessionOptions} from "express-session";
import {IKey} from "../../types/IKey";
import MySQLStore = require("express-mysql-session");
import {BaseMemoryStore} from "express-session";

@injectable()
export class DBSession {
    constructor(
        @inject(CONFIG) private config: IConfig,
        @inject(KEY) private keys: IKey,
    ) {}

    private get options(): SessionOptions {
        return {
            name: this.keys.EXPRESS_SESSION_COOKIE_NAME,
            secret: this.keys.JSON_WEB_TOKEN_KEY,
            store: this.store as MemoryStore,
            resave: false,
            saveUninitialized: false
        };
    }

    private get store(): BaseMemoryStore {
        return new MySQLStore({
            database: this.config.DATABASE_NAME,
            host: this.config.DATABASE_HOSTNAME,
            user: this.config.DATABASE_USER,
            password: this.keys.DATABASE_PASSWORD,
            expiration: this.config.JSON_WEB_TOKEN_EXPIRED_TIME
        });
    }

    public get middleware(): RequestHandler {
        return session(this.options);
    }
}