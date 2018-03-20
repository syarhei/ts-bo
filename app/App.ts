import * as e from "express";
import {Application} from "express";
import * as Bluebird from "bluebird";
import {injectable, inject} from "inversify";
import {DATABASE_CONTEXT, MAIN_CONTROLLER} from "./inversify/identifiers/common";
import {DBContext} from "./DBContext";
import {MainController} from "./src/routes/MainController";

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
        this.app.use("/api", this.mainController.router);
    }

    async sync(): Promise<void> {
        await this.dbContext.init();
    }

    async start(): Promise<void> {
        const blueBird: (port: number) => Bluebird<void> = Bluebird.promisify<void, number>(this.app.listen, {});
        await blueBird(this.port).then(() => {
            console.log(`Server is starting on ${this.port} port`);
        }, err => {
            console.log(err);
        });
    }
}