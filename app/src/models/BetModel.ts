import {STRING, BOOLEAN, Sequelize, default as sequelize} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION, MATCH_MODEL, USER_MODEL} from "../../inversify/identifiers/common";
import {DBConnection} from "../../DBConnection";
import {Bet} from "./contracts/Bet";
import {MatchModel} from "./MatchModel";
import {UserModel} from "./UserModel";

const USER_TABLE: string = "Bet";

@injectable()
export class BetModel {
    private connection: Sequelize;
    constructor(
        @inject(DATABASE_CONNECTION) {connection}: DBConnection,
        @inject(MATCH_MODEL) private matchModel: MatchModel,
        @inject(USER_MODEL) private userModel: UserModel
    ) {
        this.connection = connection;
    }

    public get model(): sequelize.Model<sequelize.Instance<Bet>, Bet> {
        return this.connection.define<sequelize.Instance<Bet>, Bet>(USER_TABLE, {
            "id": {
                type: STRING(30),
                primaryKey: true
            },
            "matchId": {
                type: STRING(30),
                references: {
                    model: this.matchModel.model,
                    key: "id"
                }
            },
            "userId": {
                type: STRING(30),
                references: {
                    model: this.userModel.model,
                    key: "id"
                }
            },

        }, {});
    }
}