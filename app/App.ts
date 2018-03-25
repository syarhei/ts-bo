import * as e from "express";
import {Application} from "express";
import * as Bluebird from "bluebird";
import {injectable, inject} from "inversify";
import {DATABASE_CONTEXT, MAIN_CONTROLLER} from "./inversify/identifiers/common";
import {DBContext} from "./DBContext";
import {MainController} from "./src/routes/MainController";
import * as bodyParser from "body-parser";
import {ErrorHandler} from "./src/middlewares/ErrorHandler";

@injectable()
export class App {
    private port: number = null;
    private app: Application = null;

    constructor(
        @inject(DATABASE_CONTEXT) private dbContext: DBContext,
        @inject(MAIN_CONTROLLER) private mainController: MainController
    ) {
        const port: string = process.env.PORT;
        this.port = port ? Number.parseInt(port) : 8080;
        this.app = e();
    }

    init(): void {
        this.app.use(bodyParser.json({}));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use("/api", this.mainController.router);
        this.app.use("/api", ErrorHandler.middleware);
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