import {STRING, BOOLEAN, Sequelize, default as sequelize} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION} from "../../inversify/identifiers/common";
import {DBConnection} from "../../DBConnection";
import {MatchCategory} from "../contracts/MatchCategory";

const USER_TABLE: string = "MatchCategory";

@injectable()
export class MatchCategoryModel {
    private connection: Sequelize;
    constructor(
        @inject(DATABASE_CONNECTION) {connection}: DBConnection
    ) {
        this.connection = connection;
    }

    public get model(): sequelize.Model<sequelize.Instance<MatchCategory>, MatchCategory> {
        return this.connection.define<sequelize.Instance<MatchCategory>, MatchCategory>(USER_TABLE, {
            "id": {
                type: STRING(36),
                primaryKey: true
            },
            "name": {
                type: STRING(20),
                unique: true,
                allowNull: false
            },
            "description": {
                type: STRING(50)
            },
            "isContinental": {
                type: BOOLEAN,
                defaultValue: false
            },
            "country": {
                type: STRING(30)
            },
            "isFinished": {
                type: BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: false
        });
    }
}