import {inject, injectable} from "inversify";
import {USER_DAL} from "../../inversify/identifiers/common";
import {UserDAL} from "../DAL/UserDAL";
import {User} from "../models/contracts/User";
import * as Bluebird from "bluebird";
import {UserError} from "../models/exceptions/UserError";

@injectable()
export class AuthService {
    constructor(
        @inject(USER_DAL) private userDAL: UserDAL
    ) {}

    public async singUp(nickname: string, email: string, password: string): Promise<User> {
        const [usersWithNickname, usersWithEmail] = await Bluebird.all<User[], User[]>([
            this.userDAL.getUsersByNickName(nickname),
            this.userDAL.getUsersByEmail(email)
        ]);

        if (usersWithNickname.length) {
            throw new UserError(`This nickname already exists`, 4);
        }

        if (usersWithEmail.length) {
            throw new UserError(`This email already is used in the system`, 4);
        }

        const userData: User = {
            id: null,
            nickname: nickname,
            firstName: null,
            lastName: null,
            country: null,
            city: null,
            address: null,
            GTM: 3,
            mobilePhone: "+112422151",
            dayOfBirthDay: 421526161,
            balance: 1000,
            email: email,
            role: "user",
            password: password
        };

        return this.userDAL.createUser(userData);
    }

    public async logIn(nickname: string, password: string): Promise<User> {
        const [user]: User[] = await this.userDAL.getUsersByNickName(nickname);
        if (!user) {
            throw new UserError(`User is not found by nickname`);
        }
        if (user.password !== password) {
            throw new UserError(`User's password is not correct`);
        }
        return user;
    }
}