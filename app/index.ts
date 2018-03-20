import container from "./inversify/config";
import {App} from "./App";
import {APPLICATION} from "./inversify/identifiers/common";

async function main() {
    const app: App = container.get<App>(APPLICATION);
    app.init();
    await app.sync();
    await app.start();
}

(async () => { await main(); })();