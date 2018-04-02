import {STRING, INTEGER, Sequelize, default as sequelize} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION} from "../../inversify/identifiers/common";
import {DBConnection} from "../../DBConnection";
import {Team} from "./contracts/Team";

const USER_TABLE: string = "Team";

@injectable()
export class TeamModel {
    private connection: Sequelize;
    constructor(
        @inject(DATABASE_CONNECTION) {connection}: DBConnection
    ) {
        this.connection = connection;
    }

    public get model(): sequelize.Model<sequelize.Instance<Team>, Team> {
        return this.connection.define<sequelize.Instance<Team>, Team>(USER_TABLE, {
            "id": {
                type: STRING(36),
                primaryKey: true
            },
            "name": {
                type: sequelize.STRING(20),
                unique: true
            },
            "owner": {
                type: sequelize.STRING(20),
                allowNull: false,
            },
            "country": {
                type: sequelize.STRING(20),
                allowNull: false,
            },
            "year": {
                type: sequelize.INTEGER,
                allowNull: false,
            },
            "wins": {
                type: sequelize.INTEGER,
            },
            "draws": {
                type: sequelize.INTEGER,
                defaultValue: 0
            },
            "loses": {
                type: sequelize.INTEGER,
                defaultValue: 0
            }
        }, {});
    }
}