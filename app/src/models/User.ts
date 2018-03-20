import {STRING, Sequelize, default as sequelize, INTEGER} from "sequelize";
import {injectable, inject} from "inversify";
import {DATABASE_CONNECTION} from "../../inversify/identifiers/common";

const USER_TABLE: string = "User";

export interface User {
    nickname: string;
    password: string;
    balance: number;
    email: string;
    role: string;
}

@injectable()
export class UserModel {
    constructor(
        @inject(DATABASE_CONNECTION) private connection: Sequelize
    ) {}

    public get model(): sequelize.Model<User, User> {
        return this.connection.define<User, User>(USER_TABLE, {
            "nickname": {
                type: STRING(30),
                primaryKey: true
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
            "email": {
                type: STRING(30),
                allowNull: false,
                unique: true
            },
            "role": {
                type: STRING(5),
                allowNull: false
            }
        }, {});
    }
}