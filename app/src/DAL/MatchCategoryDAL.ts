import {inject, injectable} from "inversify";
import {MATCH_CATEGORY_MODEL} from "../../inversify/identifiers/common";
import {MatchCategory} from "../models/contracts/MatchCategory";
import {DBContext} from "../../DBContext";
import * as sequelize from "sequelize";

@injectable()
export class MatchCategoryDAL {
    private matchCategory: sequelize.Model<sequelize.Instance<MatchCategory>, MatchCategory> = null;
    constructor(@inject(MATCH_CATEGORY_MODEL) dbContext: DBContext) {
        this.matchCategory = dbContext.MATCH_CATEGORY;
    }

    public async createMatchCategory(matchCategoryOptions: MatchCategory): Promise<MatchCategory> {
        const category = await this.matchCategory.create(matchCategoryOptions);
        return category.get();
    }

    public async getMatchCategories(): Promise<MatchCategory[]> {
        const categories = await this.matchCategory.findAll();
        return categories.map(category => category.get());
    }

    public async getMatchCategoryById(id: string): Promise<MatchCategory> {
        const category = await this.matchCategory.findById(id);
        return category.get();
    }

    public async updateMatchCategory(id: string, matchCategoryOptions: MatchCategory): Promise<MatchCategory> {
        const [, [category]] = await this.matchCategory
            .update(matchCategoryOptions, {where: { id }});
        return category.get();
    }

    public async deleteMatchCategory(id: string): Promise<boolean> {
        const number = await this.matchCategory.destroy({where: { id }});
        return number > 0;
    }
}