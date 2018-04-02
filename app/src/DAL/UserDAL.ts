import {injectable, inject} from "inversify";
import {DBContext} from "../../DBContext";
import * as sequelize from "sequelize";
import {DATABASE_CONTEXT} from "../../inversify/identifiers/common";
import {User} from "../models/contracts/User";

@injectable()
export class UserDAL {
    private user: sequelize.Model<sequelize.Instance<User>, User> = null;
    constructor(@inject(DATABASE_CONTEXT) dbContext: DBContext) {
        this.user = dbContext.USER;
    }

    public async createUser(userOptions: User): Promise<User> {
        const user = await this.user.create(userOptions);
        return user.get();
    }

    public async getUsersByNickName(nickname: string): Promise<User[]> {
        const users = await this.user
            .findAll({ where: { nickname } });
        return users.map((user: sequelize.Instance<User>) => user.get());
    }

    public async getUsersByEmail(email: string): Promise<User[]> {
        const users = await this.user
            .findAll({ where: { email } });
        return users.map((user: sequelize.Instance<User>) => user.get());
    }

    public async getUserById(id: string): Promise<User> {
        const user = await this.user.findById(id);
        return user.get();
    }
}