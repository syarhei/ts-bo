import {injectable, inject} from "inversify";
import {DBContext} from "../../DBContext";
import * as sequelize from "sequelize";
import {DATABASE_CONTEXT} from "../../inversify/identifiers/common";
import {User} from "../models/contracts/User";

@injectable()
export class UserDAL {
    private user: sequelize.Model<User, User> = null;

    constructor(@inject(DATABASE_CONTEXT) dbContext: DBContext) {
        this.user = dbContext.USER;
    }
}
