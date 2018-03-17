import * as e from "express";
import {Application} from "express";

export class App {
    private port: number = null;
    private app: Application = null;

    constructor() {
        const port: string = process.env.PORT;
        this.port = port ? Number.parseInt(port) : 8080;
        this.app = e();
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is starting`);
        })
    }
}