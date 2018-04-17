import {admin, user1} from "../TestEnvironment";
import {assert} from "chai";
import {Response} from "request";
import {config} from "../TestConfig";

before("Login admin", async () => {
    const data = {
        username: config.admin.nickname,
        password: config.admin.password
    };
    const res: Response = await admin.post("/api/sessions", { body: data });
    assert.deepEqual(res.statusCode, 200);
});

after("Delete user", async () => {
    const resForLogoutForUser1: Response = await user1.delete("/api/sessions");
    assert.deepEqual(resForLogoutForUser1.statusCode, 200);

    const resForDeleteUser: Response = await admin.delete(`api/users/${config.user1.id}`);
    assert.deepEqual(resForDeleteUser.statusCode, 204);

    const resForLogoutForAdmin: Response = await admin.delete("/api/sessions");
    assert.deepEqual(resForLogoutForAdmin.statusCode, 200);
});