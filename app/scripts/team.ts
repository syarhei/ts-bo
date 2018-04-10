import container from "../inversify/config";
import {TeamDAL} from "../src/DAL/TeamDAL";
import {TEAM_DAL, TEAM_MODEL} from "../inversify/identifiers/common";
import uuid = require("uuid");
import {TeamModel} from "../src/models/TeamModel";
import {Team} from "../src/models/contracts/Team";
import * as sequelize from "sequelize";

let teamDAL: TeamDAL = null;
let teamModel: sequelize.Model<sequelize.Instance<Team>, Team> = null;

async function init(): Promise<void> {
    await container.get<TeamModel>(TEAM_MODEL).model.sync();
    teamDAL = container.get<TeamDAL>(TEAM_DAL);
    teamModel = container.get<TeamModel>(TEAM_MODEL).model;
}

async function createTeam(): Promise<void> {
    const team = await teamDAL.createTeam({
        id: uuid(),
        name: "My Team",
        country: "Belarus",
        year: 2018,
        owner: "Siarhei Murkou"
    });
    console.log(team);
}

async function getTeam(): Promise<void> {
    const team = await teamDAL.getTeamById("3634bc26-adc8-4dc3-ba78-c6003f70f8e8");
    console.log(team);
}

async function updateTeam(): Promise<void> {
    await teamDAL.updateTeam("3634bc26-adc8-4dc3-ba78-c6003f70f8e8", {name: "Govnische"} as Team);
}

async function deleteTeam(): Promise<void> {
    const result = await teamDAL.deleteTeam("3634bc26-adc8-4dc3-ba78-c6003f70f8e8");
    console.log(result);
}

(async () => {
    try {
        await init();
        process.exit();
    } catch (err) {
        debugger;
    }
})();