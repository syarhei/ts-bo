import {TeamOptionsForCreate} from "../../src/contracts/team/TeamOptionsForCreate";
import {Response} from "request";
import {Team} from "../../src/contracts/Team";
import {assert} from "chai";
import {TeamOptionsForUpdate} from "../../src/contracts/team/TeamOptionsForUpdate";
import {admin, user1} from "../TestEnvironment";

const TEAM_NAME_1 = `Team-Test-1`;
const TEAM_NAME_2 = `Team-Test-2`;

describe("Team's Operations", async () => {
    let teamId: string = null;

    it("Create Team", async () => {
        const teamOptions: TeamOptionsForCreate = {
            name: TEAM_NAME_1,
            owner: "Siarhei Murkou",
            year: 2018,
            country: "Belarus"
        };
        const result: Response = await admin.post("/api/teams", { body: teamOptions });
        const team: Team = result.body;
        assert.deepEqual(result.statusCode, 201);
        assert.deepEqual(team.name, TEAM_NAME_1);
        teamId = team.id;
    });

    it("Check Team after creation", async () => {
        const result: Response = await user1.get(`api/teams/${teamId}`);
        const team: Team = result.body;
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(team.name, TEAM_NAME_1);
    });

    it("Update Team", async () => {
        const teamOptions: TeamOptionsForUpdate = {
            name: TEAM_NAME_2
        };
        const result: Response = await admin.put(`/api/teams/${teamId}`, { body: teamOptions });
        assert.deepEqual(result.statusCode, 204);
    });

    it("Check Team after updating", async () => {
        const result: Response = await user1.get(`/api/teams/${teamId}`);
        const team: Team = result.body;
        assert.deepEqual(result.statusCode, 200);
        assert.deepEqual(team.name, TEAM_NAME_2);
    });

    it("Delete Team", async () => {
        const result: Response = await admin.del(`/api/teams/${teamId}`);
        assert.deepEqual(result.statusCode, 204);
    });

    it("Check Team after deleting", async () => {
        const result: Response = await user1.get(`/api/teams/${teamId}`);
        assert.deepEqual(result.statusCode, 404);
    });
});