import * as e from "express";
import {Application} from "express";
import * as Bluebird from "bluebird";
import {injectable, inject} from "inversify";
import {
    PASSPORT_HANDLER, DATABASE_CONTEXT, KEY, MAIN_CONTROLLER, PASSPORT, DATABASE_SESSION
} from "./inversify/identifiers/common";
import {DBContext} from "./src/DB/DBContext";
import {MainController} from "./src/routes/MainController";
import * as bodyParser from "body-parser";
import {ErrorHandler} from "./src/middlewares/ErrorHandler";
import {Authenticator} from "passport";
import {PassportHandler} from "./src/middlewares/PassportHandler";
import {IKey} from "./types/IKey";
import {DBSession} from "./src/DB/DBSession";
import {logRequestResponse} from "./utils/logger";

@injectable()
export class App {
    private port: number = null;
    private app: Application = null;

    constructor(
        @inject(DATABASE_CONTEXT) private dbContext: DBContext,
        @inject(DATABASE_SESSION) private dbSession: DBSession,
        @inject(MAIN_CONTROLLER) private mainController: MainController,
        @inject(PASSPORT) private passport: Authenticator,
        @inject(PASSPORT_HANDLER) private passportHandler: PassportHandler,
        @inject(KEY) private keys: IKey
    ) {
        const port: string = process.env.PORT;
        this.port = port ? Number.parseInt(port) : 8080;
        this.app = e();
    }

    init(): void {
        this.app.use(logRequestResponse);
        this.app.use(this.dbSession.middleware);
        this.app.use(bodyParser.json({}));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(this.passport.initialize());
        this.app.use(this.passport.session());
        this.app.use("/api", this.mainController.router);
        this.app.use("/api", ErrorHandler.middleware);

        this.passportHandler.init();
        this.passportHandler.serialize();
        this.passportHandler.deserialize();
    }

    async sync(): Promise<void> {
        await this.dbContext.init();
    }

    async start(): Promise<void> {
        const listenAsync: (port: number) => Bluebird<void> =
            Bluebird.promisify<void, number>(this.app.listen, {context: this.app});
        await listenAsync(this.port);
        console.log(`Server is starting on ${this.port} port`);
    }
}