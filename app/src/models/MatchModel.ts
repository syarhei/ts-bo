import {STRING, REAL, INTEGER, Sequelize, default as sequelize, BIGINT} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION, MATCH_CATEGORY_MODEL, TEAM_MODEL} from "../../inversify/identifiers/common";
import {DBConnection} from "../DB/DBConnection";
import {Match} from "../contracts/Match";
import {TeamModel} from "./TeamModel";
import {MatchCategoryModel} from "./MatchCategoryModel";

const USER_TABLE: string = "Match";

@injectable()
export class MatchModel {
    private connection: Sequelize;
    constructor(
        @inject(DATABASE_CONNECTION) {connection}: DBConnection,
        @inject(TEAM_MODEL) private teamModel: TeamModel,
        @inject(MATCH_CATEGORY_MODEL) private matchCategory: MatchCategoryModel,
    ) {
        this.connection = connection;
    }

    public get model(): sequelize.Model<sequelize.Instance<Match>, Match> {
        return this.connection.define<sequelize.Instance<Match>, Match>(USER_TABLE, {
            "id": {
                type: STRING(36),
                primaryKey: true
            },
            "teamHomeId": {
                type: STRING(36),
                references: {
                    model: this.teamModel.model,
                    key: "id"
                }
            },
            "teamGuestId": {
                type: STRING(36),
                references: {
                    model: this.teamModel.model,
                    key: "id"
                }
            },
            "matchCategoryId": {
                type: STRING(36),
                references: {
                    model: this.matchCategory.model,
                    key: "id"
                }
            },
            "coefficientWin1": {
                type: REAL
            },
            "coefficientDraw": {
                type: REAL
            },
            "coefficientWin2": {
                type: REAL
            },
            "place": {
                type: STRING(30)
            },
            "date": {
                type: BIGINT,
                allowNull: false
            },
            "homeGoals": {
                type: INTEGER
            },
            "guestGoals": {
                type: INTEGER
            },
            "result": {
                type: STRING(2)
            }
        }, {
            timestamps: false
        });
    }
}