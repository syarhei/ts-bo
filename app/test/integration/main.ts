import {admin, user1} from "../TestEnvironment";
import {assert} from "chai";
import {Response} from "request";
import {config} from "../TestConfig";
import container from "../../inversify/config";
import {IKey} from "../../types/IKey";
import {KEY} from "../../inversify/identifiers/common";

before("Login admin", async () => {
    const data = {
        username: container.get<IKey>(KEY).ADMIN_NICKNAME,
        password: container.get<IKey>(KEY).ADMIN_PASSWORD
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