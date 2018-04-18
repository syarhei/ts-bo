import {inject, injectable} from "inversify";
import * as sequelize from "sequelize";
import {Bet} from "../contracts/Bet";
import {DATABASE_CONTEXT} from "../../inversify/identifiers/common";
import {DBContext} from "../../DBContext";

@injectable()
export class BetDAL {
    private bet: sequelize.Model<sequelize.Instance<Bet>, Bet> = null;
    constructor(@inject(DATABASE_CONTEXT) dbContext: DBContext) {
        this.bet = dbContext.BET;
    }

    public async createBet(betOptions: Bet): Promise<Bet> {
        const bet = await this.bet.create(betOptions);
        return bet.get();
    }
}