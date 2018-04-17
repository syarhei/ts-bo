import uuid = require("uuid");

interface TestConfig {
    user1: { id: string; nickname: string; password: string; email: string; };
    admin: { id: string; nickname: string; password: string };
}

export const config: TestConfig = {
    user1: { id: null, nickname: `Test-User-${uuid().substr(0, 13)}`,
        password: `TestPassword`, email: `test-${uuid().substr(0, 13)}` },
    admin: { id: "0", nickname: "admin", password: "Admin123" }
};