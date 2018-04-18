import {user1} from "../TestEnvironment";
import {UserOptionsForCreate} from "../../src/contracts/user/UserOptionsForCreate";
import {assert} from "chai";
import {User} from "../../src/contracts/User";
import {Response} from "request";
import {config} from "../TestConfig";

describe("SignUp and LogIn", async () => {
    it("SignUp", async () => {
        const data: UserOptionsForCreate = {
            nickname: config.user1.nickname,
            country: "Belarus",
            city: "Minks",
            mobilePhone: "+375295573641",
            email: config.user1.email,
            password: config.user1.password
        };
        const res: Response = await user1.post("/api/users", { body: data });
        const user: User = res.body;
        assert.deepEqual(res.statusCode, 201);
        assert.deepEqual(user.nickname, config.user1.nickname);
        config.user1.id = user.id;
    });

    it("LogIn", async () => {
        const data = {
            username: config.user1.nickname,
            password: config.user1.password
        };
        const res: Response = await user1.post("/api/sessions", { body: data });
        assert.deepEqual(res.statusCode, 200);
    });
});