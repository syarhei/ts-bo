import {inject, injectable} from "inversify";
import {MatchDAL} from "../DAL/MatchDAL";
import {Match} from "../contracts/Match";
import uuid = require("uuid");
import {MatchError} from "../exceptions/MatchError";
import {MATCH_DAL} from "../../inversify/identifiers/common";

@injectable()
export class MatchService {
    constructor(
        @inject(MATCH_DAL) private matchDAL: MatchDAL
    ) {}

    public async createMatch(matchCategoryId: string, teamHomeId: string, teamGuestId: string, place: string): Promise<Match> {
        const data: Match = {
            id: uuid(),
            matchCategoryId,
            teamHomeId,
            teamGuestId,
            date: Date.now(),
            place: place,
        } as Match;
        return this.matchDAL.createMatch(data);
    }

    public async createMatchWithCoefficients(options: Match): Promise<Match> {
        const data: Match = {
            id: uuid(),
            matchCategoryId: options.matchCategoryId,
            teamHomeId: options.teamHomeId,
            teamGuestId: options.teamGuestId,
            coefficientWin1: options.coefficientWin1,
            coefficientDraw: options.coefficientDraw,
            coefficientWin2: options.coefficientWin2,
            date: Date.now(),
            place: options.place
        };
        return this.matchDAL.createMatch(data);
    }

    public async addCoefficientsToMatch(matchId: string, coefficientWin1: number): Promise<void> {
        const data: Match = {
            coefficientWin1
        } as Match;
        const isUpdated: boolean = await this.matchDAL.updateMatchProps(matchId, data);
        if (!isUpdated) {
            throw new MatchError(`Match is not found`, 1);
        }
    }

    public async getMatchesByTeam(teamId: string, limit: number): Promise<{ attack: number, defence: number }> {
        const matches: Match[] = await this.matchDAL.searchLastMatches(teamId, limit);
        const homeGoals: number[] = matches.map(match => match.homeGoals);
        const guestGoals: number[] = matches.map(match => match.guestGoals);
        const attack: number = homeGoals.reduce((memory: number, value: number) => memory + value, 0) / limit;
        const defence: number = limit / guestGoals.reduce((memory: number, value: number) => memory + value, 0);
        return { attack, defence };
    }
}