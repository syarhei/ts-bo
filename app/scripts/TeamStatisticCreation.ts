import {Team} from "../src/contracts/Team";
import uuid = require("uuid");
import {MatchCategory} from "../src/contracts/MatchCategory";
import container from "../inversify/config";
import {DATABASE_CONTEXT} from "../inversify/identifiers/common";
import {Match} from "../src/contracts/Match";
import {Op} from "sequelize";

interface TeamValue {
    key: string;
    name: string;
    code: string;
}

interface Round {
    name: string;
    matches: MatchValue[]
}

interface MatchValue {
    date: string;
    team1: TeamValue;
    team2: TeamValue;
    score1: number;
    score2: number;
}

const { clubs }: { name: string, clubs: TeamValue[] } = require("../../statistics/2012-13/en.1.clubs.json");
const BPL: { name: string, rounds: Round[] } = require("../../statistics/2012-13/en.1.json");

const COUNTRY: string = "England";
let categoryId: string = uuid();

const teams: Team[] = clubs.map(club => {
    return {
        id: uuid(),
        name: club.name,
        year: 2018,
        country: COUNTRY,
        owner: "Siarhei Murkou"
    } as Team;
});

const matchValues: MatchValue[] = [];
BPL.rounds.forEach((round, index, rounds) => {
    if (index !== rounds.length - 1) {
        matchValues.push(...round.matches);
    }
});
const matches: Match[] = matchValues.map(match => {
    return {
        id: uuid(),
        matchCategoryId: categoryId,
        teamHomeId: teams.find(team => team.name === match.team1.name).id,
        teamGuestId: teams.find(team => team.name === match.team2.name).id,
        date: Date.parse(match.date),
        place: COUNTRY,
        homeGoals: match.score1,
        guestGoals: match.score2
    } as Match;
});

export function getMatchesOfLastRound(): Match[] {
    return BPL.rounds[BPL.rounds.length - 1].matches.map(match => {
        return {
            id: uuid(),
            matchCategoryId: categoryId,
            teamHomeId: teams.find(team => team.name === match.team1.name).id,
            teamGuestId: teams.find(team => team.name === match.team2.name).id,
            date: Date.parse(match.date),
            place: COUNTRY,
            homeGoals: match.score1,
            guestGoals: match.score2
        } as Match;
    })
}

const context: any = container.get(DATABASE_CONTEXT);

async function createTeams() {
    try {
        await context.TEAM.bulkCreate(teams);
    } catch (err) {
        console.log(`Error during Team creation`);
        throw err;
    }
}

async function createMatchCategory() {
    try {
        const category: MatchCategory = {
            id: categoryId,
            name: BPL.name,
            country: COUNTRY,
            isContinental: false,
            isFinished: false
        };
        await context.MATCH_CATEGORY.create(category);
    } catch (err) {
        console.log(`Error during MatchCategory creation`);
        throw err;
    }
}

async function createMatches() {
    try {
        await context.MATCH.bulkCreate(matches);
    } catch (err) {
        console.log(`Error during Match creation`);
        throw err;
    }
}

export async function deleteFootballSet(matchIds: string[], categoryId: string, teamIds: string[]) {
    await context.MATCH.destroy({ where: { id: { [Op.or]: matchIds } } });
    await context.MATCH_CATEGORY.destroy({ where: { id: categoryId } });
    await context.TEAM.destroy({ where: { id: { [Op.or]: teamIds } } });
    console.log("Football Statistic is deleted from database");
}

export async function createFootballSet(): Promise<{ teams: Team[], categoryId: string, matches: Match[] }> {
    await createTeams();
    await createMatchCategory();
    await createMatches();
    console.log("Football Statistic is uploaded to database");
    return { teams, categoryId, matches };
}

// (async () => {
//     try {
//         if (require.main === module) {
//             await createFootballSet();
//             process.exit(0);
//         }
//     } catch (err) {
//         console.log(err);
//         process.exit(-1);
//     }
// })();