import {inject, injectable} from "inversify";
import {Model, default as sequelize} from "sequelize";
import {Team} from "../models/contracts/Team";
import {DATABASE_CONTEXT} from "../../inversify/identifiers/common";
import {DBContext} from "../../DBContext";

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
}