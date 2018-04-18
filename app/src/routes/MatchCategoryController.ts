import {inject, injectable} from "inversify";
import {Router, Response, Request} from "express";
import * as autoBind from "auto-bind";
import {AUTH_HANDLER, MATCH_CATEGORY_SERVICE} from "../../inversify/identifiers/common";
import * as wrap from "express-async-wrap";
import {AuthHandler} from "../middlewares/AuthHandler";
import {MatchCategoryService} from "../services/MatchCategoryService";
import {MatchCategory} from "../contracts/MatchCategory";
import {MatchCategoryOptionsForCreate} from "../contracts/match-category/MatchCategoryOptionsForCreate";
import {MatchCategoryOptionsForUpdate} from "../contracts/match-category/MatchCategoryOptionsForUpdate";

@injectable()
export class MatchCategoryController {
    constructor(
        @inject(MATCH_CATEGORY_SERVICE) private categoryService: MatchCategoryService,
        @inject(AUTH_HANDLER) private authHandler: AuthHandler
    ) {
        autoBind(this);
    }

    public set router(router: Router) {}

    public get router(): Router {
        const router = Router();

        router.post("/match-categories", this.authHandler.adminAuth, wrap(this.createCategory));
        router.get("/match-categories/:categoryId", wrap(this.getCategory));
        router.put("/match-categories/:categoryId", this.authHandler.adminAuth, wrap(this.updateCategory));
        router.delete("/match-categories/:categoryId", this.authHandler.adminAuth, wrap(this.deleteCategory));

        return router;
    }

    private async createCategory(req: Request, res: Response): Promise<void> {
        const categoryOptions: MatchCategoryOptionsForCreate = req.body;
        const category: MatchCategory = await this.categoryService.createCategory(categoryOptions);
        res.status(201).json(category);
    }

    private async getCategory(req: Request, res: Response): Promise<void> {
        const categoryId: string = req.params.categoryId;
        const category: MatchCategory = await this.categoryService.getCategoryById(categoryId);
        res.status(200).json(category);
    }

    private async updateCategory(req: Request, res: Response): Promise<void> {
        const categoryId: string = req.params.categoryId;
        const categoryOptions: MatchCategoryOptionsForUpdate = req.body;
        await this.categoryService.updateCategoryById(categoryId, categoryOptions);
        res.status(204).end();
    }

    private async deleteCategory(req: Request, res: Response): Promise<void> {
        const categoryId: string = req.params.categoryId;
        await this.categoryService.deleteMatchCategoryById(categoryId);
        res.status(204).end();
    }
}