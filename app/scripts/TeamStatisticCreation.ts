import {Team} from "../src/contracts/Team";
import uuid = require("uuid");
import {MatchCategory} from "../src/contracts/MatchCategory";
import container from "../inversify/config";
import {DATABASE_CONTEXT} from "../inversify/identifiers/common";
import {DBContext} from "../src/DB/DBContext";
import {Match} from "../src/contracts/Match";

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

let categoryId: string = uuid();
let teams: Team[] = null;
const COUNTRY: string = "England";
const matchValues: MatchValue[] = [];
BPL.rounds.forEach(round => {
    matchValues.push(...round.matches);
});

const context = container.get<DBContext>(DATABASE_CONTEXT);

async function createTeams() {
    try {
        teams = clubs.map(club => {
            return {
                id: uuid(),
                name: club.name,
                year: 2018,
                country: COUNTRY,
                owner: "Siarhei Murkou"
            } as Team;
        });
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
        await context.MATCH.bulkCreate(matches);
    } catch (err) {
        console.log(`Error during Match creation`);
        throw err;
    }
}

export async function createFootballSet(): Promise<{ teams: Team[], categoryId: string }> {
    try {
        await createTeams();
        await createMatchCategory();
        await createMatches();
        console.log("Football Statistic is uploaded to database");
        return { teams, categoryId };
    } catch (err) {
        console.log(err);
    }
}

(async () => {
    try {
        if (require.main === module) {
            await createFootballSet();
            process.exit(0);
        }
    } catch (err) {
        process.exit(-1);
    }
})();