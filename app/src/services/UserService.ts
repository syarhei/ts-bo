import {inject, injectable} from "inversify";
import {USER_DAL} from "../../inversify/identifiers/common";
import {UserDAL} from "../DAL/UserDAL";
import {User} from "../models/contracts/User";
import {UserError} from "../models/exceptions/UserError";

@injectable()
export class UserService {
    constructor(@inject(USER_DAL) private userDAL: UserDAL) {}

    public async getUserById(userId: string): Promise<User> {
        const user: User = await this.userDAL.getUserById(userId);
        if (!user) {
            throw new UserError(`User is not found`, 1);
        }
        return user;
    }

    public async deleteUserById(userId: string): Promise<void> {
        const isDeleted: boolean = await this.userDAL.deleteUser(userId);
        if (!isDeleted) {
            throw new UserError(`User is not deleted`, 1);
        }
    }
}