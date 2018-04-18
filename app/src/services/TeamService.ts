import {inject, injectable} from "inversify";
import {TEAM_DAL} from "../../inversify/identifiers/common";
import {TeamDAL} from "../DAL/TeamDAL";
import {Team} from "../contracts/Team";
import {TeamOptionsForCreate} from "../contracts/team/TeamOptionsForCreate";
import uuid = require("uuid");
import {TeamError} from "../exceptions/TeamError";
import {TeamOptionsForUpdate} from "../contracts/team/TeamOptionsForUpdate";

@injectable()
export class TeamService {
    constructor(@inject(TEAM_DAL) private teamDAL: TeamDAL) {}

    public async createTeam(teamOptions: TeamOptionsForCreate) {
        const team: Team = {
            id: uuid(),
            name: teamOptions.name,
            owner: teamOptions.owner,
            country: teamOptions.country,
            year: teamOptions.year
        };
        return this.teamDAL.createTeam(team);
    }

    public async getTeamById(teamId: string) {
        const team = await this.teamDAL.getTeamById(teamId);
        if (!team) {
            throw new TeamError(`Team is not found`, 1);
        }
        return team;
    }

    public async updateTeamById(teamId: string, teamOptions: TeamOptionsForUpdate) {
        const team: Team = await this.getTeamById(teamId);
        const data: TeamOptionsForUpdate = {
            name: teamOptions.name ? teamOptions.name : team.name,
            owner: teamOptions.owner ? teamOptions.owner : team.owner,
            country: teamOptions.country ? teamOptions.country : team.country,
            year: teamOptions.year ? teamOptions.year : team.year
        };
        const isUpdated: boolean = await this.teamDAL.updateTeam(teamId, teamOptions);
        if (!isUpdated) {
            throw new TeamError(`Team is not updated`, 1);
        }
    }

    public async deleteTeamById(teamId: string) {
        const isDeleted: boolean = await this.teamDAL.deleteTeam(teamId);
        if (!isDeleted) {
            throw new TeamError(`Team is not deleted`, 1);
        }
    }
}