import {inject, injectable} from "inversify";
import {Team} from "../models/contracts/Team";
import {DATABASE_CONTEXT} from "../../inversify/identifiers/common";
import {DBContext} from "../../DBContext";
import * as sequelize from "sequelize";

@injectable()
export class TeamDAL {
    private team: sequelize.Model<sequelize.Instance<Team>, Team> = null;
    constructor(@inject(DATABASE_CONTEXT) dbContext: DBContext) {
        this.team = dbContext.TEAM;
    }

    public async createTeam(teamOptions: Team): Promise<Team> {
        const team = await this.team.create(teamOptions);
        return team.get();
    }

    public async getTeamById(id: string): Promise<Team> {
        const team = await this.team.findById(id);
        return team.get();
    }

    public async getTeams(): Promise<Team[]> {
        const teams = await this.team.findAll();
        return teams.map(team => team.get());
    }

    public async updateTeam(id: string, teamOptions: Team): Promise<Team> {
        const [, [team]] = await this.team.update(teamOptions, {where: { id }});
        return team.get();
    }

    public async deleteTeam(id: string): Promise<boolean> {
        const number = await this.team.destroy({where: { id }});
        return number > 0;
    }
}