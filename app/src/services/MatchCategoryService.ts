import {inject, injectable} from "inversify";
import {MATCH_CATEGORY_DAL} from "../../inversify/identifiers/common";
import {MatchCategoryDAL} from "../DAL/MatchCategoryDAL";
import {MatchCategory} from "../models/contracts/MatchCategory";
import uuid = require("uuid");
import {MatchCategoryError} from "../models/exceptions/MatchCategoryError";

@injectable()
export class MatchCategoryService {
    constructor(@inject(MATCH_CATEGORY_DAL) private categoryDAL: MatchCategoryDAL) {}

    public async createCategory(categoryOptions: MatchCategory): Promise<MatchCategory> {
        const category: MatchCategory = {
            id: uuid(),
            name: categoryOptions.name,
            country: categoryOptions.country,
            description: categoryOptions.description,
            isFinished: false,
            isContinental: !categoryOptions.country
        };
        return this.categoryDAL.createMatchCategory(category);
    }

    public async getCategories(): Promise<MatchCategory[]> {
        return this.categoryDAL.getMatchCategories();
    }

    public async getCategoryById(categoryId: string): Promise<MatchCategory> {
        const category: MatchCategory = await this.categoryDAL.getMatchCategoryById(categoryId);
        if (!category) {
            throw new MatchCategoryError(`MatchCategory is not found`, 1);
        }
        return category;
    }

    public async updateCategoryById(categoryId: string, categoryOptions: MatchCategory): Promise<void> {
        const category: MatchCategory = await this.getCategoryById(categoryId);
        const data: MatchCategory = {
            name: categoryOptions.name ? categoryOptions.name : category.name,
            description: categoryOptions.description ? categoryOptions.description : category.description,
            isFinished: categoryOptions.isFinished ? categoryOptions.isFinished : category.isFinished
        } as MatchCategory;
        const isUpdated: boolean = await this.categoryDAL.updateMatchCategory(categoryId, data);
        if (!isUpdated) {
            throw new MatchCategoryError(`MatchCategory is not updated`, 1);
        }
    }

    public async deleteMatchCategoryById(categoryId: string): Promise<void> {
        const isDeleted: boolean = await this.categoryDAL.deleteMatchCategory(categoryId);
        if (!isDeleted) {
            throw new MatchCategoryError(`MatchCategory is not deleted`, 1);
        }
    }
}