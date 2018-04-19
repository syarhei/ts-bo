import {default as sequelize} from "sequelize";
import {inject, injectable} from "inversify";
import {
    BET_MODEL, DATABASE_CONNECTION, MATCH_CATEGORY_MODEL, MATCH_MODEL, TEAM_MODEL, USER_MODEL
} from "../../inversify/identifiers/common";
import {UserModel} from "../models/UserModel";
import {DBConnection} from "./DBConnection";
import {User} from "../contracts/User";
import {Team} from "../contracts/Team";
import {TeamModel} from "../models/TeamModel";
import {MatchCategoryModel} from "../models/MatchCategoryModel";
import {MatchCategory} from "../contracts/MatchCategory";
import {MatchModel} from "../models/MatchModel";
import {Match} from "../contracts/Match";
import {Bet} from "../contracts/Bet";
import {BetModel} from "../models/BetModel";

@injectable()
export class DBContext {
    constructor(
        @inject(TEAM_MODEL) private team: TeamModel,
        @inject(MATCH_CATEGORY_MODEL) private matchCategory: MatchCategoryModel,
        @inject(MATCH_MODEL) private match: MatchModel,
        @inject(USER_MODEL) private user: UserModel,
        @inject(BET_MODEL) private bet: BetModel,
        @inject(DATABASE_CONNECTION) private dbConnection: DBConnection
    ) {}

    public get TEAM(): sequelize.Model<sequelize.Instance<Team>, Team> {
        return this.team.model;
    }

    public get MATCH_CATEGORY(): sequelize.Model<sequelize.Instance<MatchCategory>, MatchCategory> {
        return this.matchCategory.model;
    }

    public get MATCH(): sequelize.Model<sequelize.Instance<Match>, Match> {
        return this.match.model;
    }

    public get USER(): sequelize.Model<sequelize.Instance<User>, User> {
        return this.user.model;
    }

    public get BET(): sequelize.Model<sequelize.Instance<Bet>, Bet> {
        return this.bet.model;
    }

    public async init(): Promise<void> {
        await this.dbConnection.connection.sync();
    }
}