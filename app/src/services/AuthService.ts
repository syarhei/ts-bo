import {inject, injectable} from "inversify";
import {USER_DAL} from "../../inversify/identifiers/common";
import {UserDAL} from "../DAL/UserDAL";
import {User} from "../models/contracts/User";
import * as Bluebird from "bluebird";
import {UserError} from "../models/exceptions/UserError";
import uuid = require("uuid");
import {USER_ROLE_NAME} from "../middlewares/AuthHandler";
import {UserOptionsForCreate} from "../models/contracts/user/UserOptionsForCreate";

@injectable()
export class AuthService {
    constructor(
        @inject(USER_DAL) private userDAL: UserDAL
    ) {}

    public async singUp(userOptions: UserOptionsForCreate): Promise<User> {
        const [usersWithNickname, usersWithEmail] = await Bluebird.all<User[], User[]>([
            this.userDAL.getUsersByNickName(userOptions.nickname),
            this.userDAL.getUsersByEmail(userOptions.email)
        ]);

        if (usersWithNickname.length) {
            throw new UserError(`This nickname already exists`);
        }

        if (usersWithEmail.length) {
            throw new UserError(`This email already is used in the system`);
        }

        const userData: User = {
            id: uuid(),
            nickname: userOptions.nickname,
            firstName: userOptions.firstName,
            lastName: userOptions.lastName,
            country: userOptions.country,
            city: userOptions.city,
            address: userOptions.address,
            GTM: userOptions.GTM ? userOptions.GTM : 3,
            mobilePhone: userOptions.mobilePhone,
            dayOfBirthDay: userOptions.dayOfBirthDay,
            balance: 1000,
            email: userOptions.email,
            role: USER_ROLE_NAME,
            password: userOptions.password
        };

        return this.userDAL.createUser(userData);
    }

    public async logIn(nickname: string, password: string): Promise<User> {
        const [user]: User[] = await this.userDAL.getUsersByNickName(nickname);
        if (!user) {
            throw new UserError(`User is not found by nickname`, 1);
        }
        if (user.password !== password) {
            throw new UserError(`User's password is not correct`, 1);
        }
        return user;
    }
}