import {admin, user1} from "../TestEnvironment";
import {MatchCategoryOptionsForCreate} from "../../src/contracts/match-category/MatchCategoryOptionsForCreate";
import {Response} from "request";
import {assert} from "chai";
import {MatchCategory} from "../../src/contracts/MatchCategory";
import {MatchCategoryOptionsForUpdate} from "../../src/contracts/match-category/MatchCategoryOptionsForUpdate";

const MATCH_CATEGORY_NAME: string = "Premier League";

describe("MatchCategory's operations", async () => {
    let matchCategoryId: string = null;

    it("Create MatchCategory", async () => {
        const data: MatchCategoryOptionsForCreate = {
            name: MATCH_CATEGORY_NAME,
            country: "England",
            description: "Championship in England (the highest division)"
        };
        const res: Response = await admin.post("/api/match-categories", { body: data });
        const category: MatchCategory = res.body;
        assert.deepEqual(res.statusCode, 201);
        assert.deepEqual(category.name, MATCH_CATEGORY_NAME);
        assert.deepEqual(category.isFinished, false);
        matchCategoryId = category.id;
    });

    it("Check MatchCategory after creation", async () => {
        const res: Response = await user1.get(`/api/match-categories/${matchCategoryId}`);
        const category: MatchCategory = res.body;
        assert.deepEqual(res.statusCode, 200);
        assert.deepEqual(category.name, MATCH_CATEGORY_NAME);
        assert.deepEqual(category.isFinished, false);
    });

    it("Update MatchCategory", async () => {
        const data: MatchCategoryOptionsForUpdate = {
            isFinished: true
        };
        const res: Response = await admin.put(`/api/match-categories/${matchCategoryId}`, { body: data });
        assert.deepEqual(res.statusCode, 204);
    });

    it("Check MatchCategory after updating", async () => {
        const res: Response = await user1.get(`/api/match-categories/${matchCategoryId}`);
        const category: MatchCategory = res.body;
        assert.deepEqual(res.statusCode, 200);
        assert.deepEqual(category.name, MATCH_CATEGORY_NAME);
        assert.deepEqual(category.isFinished, true);
    });

    it("Delete MatchCategory", async () => {
        const res: Response = await admin.delete(`/api/match-categories/${matchCategoryId}`);
        assert.deepEqual(res.statusCode, 204);
    });

    it("Check MatchCategory after deleting", async () => {
        const res: Response = await user1.get(`/api/match-categories/${matchCategoryId}`);
        assert.deepEqual(res.statusCode, 404);
    });
});