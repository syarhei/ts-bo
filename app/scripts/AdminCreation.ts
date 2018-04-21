import container from "../inversify/config";
import {UserDAL} from "../src/DAL/UserDAL";
import {KEY, USER_DAL} from "../inversify/identifiers/common";
import {User} from "../src/contracts/User";
import {IKey} from "../types/IKey";
import * as Bluebird from "bluebird";
import {ADMIN_ROLE_NAME} from "../src/middlewares/AuthHandler";
import uuid = require("uuid");
import {hash} from "bcrypt";

export async function createAdmin() {
    try {
        const mobileNumber: number = Math.round(Math.random() * 10000000);
        const keys: IKey = container.get<IKey>(KEY);
        const userDAL: UserDAL = container.get<UserDAL>(USER_DAL);

        const [usersWithNickname, usersWithEmail] = await Bluebird.all<User[], User[]>([
            userDAL.getUsersByNickName(keys.ADMIN_NICKNAME),
            userDAL.getUsersByEmail(keys.ADMIN_EMAIL)
        ]);

        if (usersWithNickname.length || usersWithEmail.length) {
            console.log(`Admin already was created`);
        } else {
            const password: string = await hash(keys.ADMIN_PASSWORD, 10);
            const user: User = {
                id: uuid(),
                nickname: keys.ADMIN_NICKNAME,
                country: "Belarus",
                city: "Minsk",
                GTM: 3,
                mobilePhone: `+37529${mobileNumber}`,
                balance: 1000000,
                email: keys.ADMIN_EMAIL,
                role: ADMIN_ROLE_NAME,
                password: password
            } as User;
            await userDAL.createUser(user);
            console.log(`Admin is created`);
        }
    } catch (err) {
        console.log(`Error during creation of Admin`);
    }
}