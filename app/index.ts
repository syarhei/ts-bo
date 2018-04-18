import container from "./inversify/config";
import {App} from "./App";
import {APPLICATION} from "./inversify/identifiers/common";
import {createAdmin} from "./scripts/AdminCreation";

async function main() {
    try {
        const app: App = container.get<App>(APPLICATION);
        app.init();
        await app.sync();
        await app.start();
        await createAdmin();
    } catch (err) {
        console.log(err);
    }
}

(async () => { await main(); })();