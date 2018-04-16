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
}