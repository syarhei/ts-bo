import container from "../inversify/config";
import {TeamDAL} from "../src/DAL/TeamDAL";
import {TEAM_DAL, TEAM_MODEL} from "../inversify/identifiers/common";
import uuid = require("uuid");
import {TeamModel} from "../src/models/TeamModel";

async function start(): Promise<void> {
    const id: string = uuid();
    await container.get<TeamModel>(TEAM_MODEL).model.sync();
    const teamDAL: TeamDAL = container.get<TeamDAL>(TEAM_DAL);
    const team = await teamDAL.createTeam({
        id: id,
        name: `Team`,
        country: "Belarus",
        year: 2018,
        owner: "Siarhei Murkou",
        wins: 0,
        draws: 0,
        loses: 0
    });
    debugger;
}

(async () => {
    try {
        await start();
    } catch (err) {
        debugger;
    }
})();