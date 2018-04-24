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

    public async getTeamAbilities(teamId: string, limit: number): Promise<{ attack: number, defence: number }> {
        const matches: Match[] = await this.matchDAL.searchLastMatches(teamId, limit);
        const GF: number[] =
            matches.map(match => match.teamHomeId === teamId ? match.homeGoals : match.guestGoals);
        const GA: number[] =
            matches.map(match => match.teamHomeId === teamId ? match.guestGoals : match.homeGoals);
        const attack: number = GF.reduce((memory: number, value: number) => memory + value, 0) / matches.length;
        const defence: number = GA.reduce((memory: number, value: number) => memory + value, 0) / matches.length;
        return { attack, defence };
    }

    public async getMatchesByTeamId(teamId: string, limit: number): Promise<Match[]> {
        return this.matchDAL.searchLastMatches(teamId, limit);
    }

    public getTeamPoints(teamId: string, matches: Match[]): number {
        const points: number[] = matches.map(match => {
            if (match.teamHomeId === teamId) {
                return match.homeGoals > match.guestGoals ? 3 : match.homeGoals === match.guestGoals ? 1 : 0;
            } else {
                return match.homeGoals < match.guestGoals ? 3 : match.homeGoals === match.guestGoals ? 1 : 0;
            }
        });
        return points.reduce((memory, value) => memory + value, 0);
    }

    public getDrawProbability(matches: Match[]): number {
        const matchesWithDrawResult: Match[] = matches.filter(match => match.homeGoals === match.guestGoals);
        return matchesWithDrawResult.length / matches.length;
    }

    public getHomeAbility(teamId: string, matches: Match[]): number {
        const matchesAtHome: Match[] = matches.filter(match => match.teamHomeId === teamId);
        const winMatchesAtHome: Match[] = matches.filter(match => match.homeGoals > match.guestGoals);
        return winMatchesAtHome.length / matchesAtHome.length;
    }
}