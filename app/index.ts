import container from "./inversify/config";
import {App} from "./App";
import {APPLICATION} from "./inversify/identifiers/common";

async function main() {
    try {
        const app: App = container.get<App>(APPLICATION);
        app.init();
        await app.sync();
        await app.start();
    } catch (err) {
        console.log(err);
    }
}

(async () => { await main(); })();