import {STRING, REAL, INTEGER, Sequelize, default as sequelize} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION, MATCH_CATEGORY_MODEL, TEAM_MODEL} from "../../inversify/identifiers/common";
import {DBConnection} from "../../DBConnection";
import {Match} from "./contracts/Match";
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
            "teamHome": {
                type: STRING(30),
                references: {
                    model: this.teamModel.model,
                    key: "id"
                }
            },
            "teamGuest": {
                type: STRING(30),
                references: {
                    model: this.teamModel.model,
                    key: "id"
                }
            },
            "matchCategoryId": {
                type: STRING(30),
                references: {
                    model: this.matchCategory.model,
                    key: "id"
                }
            },
            "coefficientWin1": {
                type: REAL,
                allowNull: false
            },
            "coefficientDraw": {
                type: REAL,
                allowNull: false
            },
            "coefficientWin2": {
                type: REAL,
                allowNull: false
            },
            "place": {
                type: STRING(30)
            },
            "date": {
                type: INTEGER,
                allowNull: false
            },
            "result": {
                type: STRING(2)
            }
        }, {
            timestamps: false
        });
    }
}