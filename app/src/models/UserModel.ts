import {STRING, INTEGER, Sequelize, default as sequelize} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION} from "../../inversify/identifiers/common";
import {DBConnection} from "../../DBConnection";
import {User} from "./contracts/User";

const USER_TABLE: string = "User";

@injectable()
export class UserModel {
    private connection: Sequelize;
    constructor(
        @inject(DATABASE_CONNECTION) {connection}: DBConnection
    ) {
        this.connection = connection;
    }

    public get model(): sequelize.Model<sequelize.Instance<User>, User> {
        return this.connection.define<sequelize.Instance<User>, User>(USER_TABLE, {
            "id": {
                type: STRING(36),
                primaryKey: true
            },
            "nickname": {
                type: STRING(30),
                unique: true
            },
            "firstName": {
                type: STRING(30)
            },
            "lastName": {
                type: STRING(30)
            },
            "dayOfBirthDay": {
                type: INTEGER
            },
            "country": {
                type: STRING(20),
                allowNull: false
            },
            "city": {
                type: STRING(20),
                allowNull: false
            },
            "address": {
                type: STRING(50)
            },
            "mobilePhone": {
                type: STRING(20),
                allowNull: false
            },
            "email": {
                type: STRING(30),
                allowNull: false,
                unique: true
            },
            "GTM": {
                type: INTEGER,
                allowNull: false
            },
            "password": {
                type: STRING(64),
                allowNull: false
            },
            "balance": {
                type: INTEGER,
                validate: {
                    min: 0
                }
            },
            "role": {
                type: STRING(5),
                allowNull: false
            }
        }, {
            timestamps: false
        });
    }
}