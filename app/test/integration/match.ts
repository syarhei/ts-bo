import {createFootballSet, deleteFootballSet, getMatchesOfLastRound} from "../../scripts/TeamStatisticCreation";
import {Team} from "../../src/contracts/Team";
import {admin} from "../TestEnvironment";
import {Response} from "request";
import {Match} from "../../src/contracts/Match";
import {assert} from "chai";

describe("Match's operations (using Math Models)", async () => {
    let categoryId: string = null;
    let teams: Team[] = null;
    let matches: Match[] = null;

    describe("BradleyTerry Model", async () => {
        before("Add Team Statistic about BPL (2012-13)", async () => {
            ({ categoryId, teams, matches } = await createFootballSet());
        });

        let countOfPredictedResults = 0;
        let countOfUnpredictedResults = 0;
        const matchesOfLastRound: Match[] = getMatchesOfLastRound();
        const matchBodies: Match[] = matchesOfLastRound.map(match => {
            return {
                teamHomeId: match.teamHomeId,
                teamGuestId: match.teamGuestId,
                matchCategoryId: match.matchCategoryId,
                date: match.date,
                place: match.place
            } as Match;
        });

        matchBodies.forEach((body, index) => {
            it(`Create match [${index}] using BradleyTerry Model`, async () => {
                const res: Response = await admin.post("/api/matches/engine/bradley-terry", { body });
                assert.deepEqual(res.statusCode, 201);
                const matchResponse: Match = res.body;
                const match: Match = matchesOfLastRound[index];
                assert.deepEqual(matchResponse.teamHomeId, match.teamHomeId);
                assert.deepEqual(matchResponse.teamGuestId, match.teamGuestId);
                if (matchResponse) {
                    matches.push(matchResponse);
                }
                if (match.homeGoals > match.guestGoals) {
                    if (
                        matchResponse.coefficientWin1 < matchResponse.coefficientDraw &&
                        matchResponse.coefficientWin1 < matchResponse.coefficientWin2
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }
                if (match.homeGoals === match.guestGoals) {
                    if (
                        matchResponse.coefficientDraw < matchResponse.coefficientWin1 &&
                        matchResponse.coefficientDraw < matchResponse.coefficientWin2
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }
                if (match.homeGoals === match.guestGoals) {
                    if (
                        matchResponse.coefficientWin2 < matchResponse.coefficientDraw &&
                        matchResponse.coefficientWin2 < matchResponse.coefficientWin1
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }

                const teamName1: string = teams.find(t => t.id === match.teamHomeId).name;
                const teamName2: string = teams.find(t => t.id === match.teamGuestId).name;
                console.log(`win1: ${matchResponse.coefficientWin1}`);
                console.log(`draw: ${matchResponse.coefficientDraw}`);
                console.log(`win2: ${matchResponse.coefficientWin2}`);
                console.log(`${teamName1} ${match.homeGoals} : ${match.guestGoals} ${teamName2}`);
            });
        });

        it("Check success of predicted result", async () => {
            console.log(`Percentage of Match's predicting is ${countOfPredictedResults / matchesOfLastRound.length}`);
        });

        after("Delete Team Statistic", async () => {
            await deleteFootballSet(
                matches.map(match => match.id),
                categoryId,
                teams.map(team => team.id)
            );
        });
    });

    describe("MaherPoisson Model", async () => {
        before("Add Team Statistic about BPL (2012-13)", async () => {
            ({ categoryId, teams, matches } = await createFootballSet());
        });

        let countOfPredictedResults = 0;
        let countOfUnpredictedResults = 0;
        const matchesOfLastRound: Match[] = getMatchesOfLastRound();
        const matchBodies: Match[] = matchesOfLastRound.map(match => {
            return {
                teamHomeId: match.teamHomeId,
                teamGuestId: match.teamGuestId,
                matchCategoryId: match.matchCategoryId,
                date: match.date,
                place: match.place
            } as Match;
        });

        matchBodies.forEach((body, index) => {
            it(`Generate coefficient [${index}]`, async function () {
                const res: Response = await admin.post("/api/matches/engine/maher-poisson", { body });
                assert.deepEqual(res.statusCode, 201);
                const matchResponse: Match = res.body;
                const match: Match = matchesOfLastRound[index];
                assert.deepEqual(matchResponse.teamHomeId, match.teamHomeId);
                assert.deepEqual(matchResponse.teamGuestId, match.teamGuestId);
                if (matchResponse) {
                    matches.push(matchResponse);
                }
                if (match.homeGoals > match.guestGoals) {
                    if (
                        matchResponse.coefficientWin1 < matchResponse.coefficientDraw &&
                        matchResponse.coefficientWin1 < matchResponse.coefficientWin2
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }
                if (match.homeGoals === match.guestGoals) {
                    if (
                        matchResponse.coefficientDraw < matchResponse.coefficientWin1 &&
                        matchResponse.coefficientDraw < matchResponse.coefficientWin2
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }
                if (match.homeGoals === match.guestGoals) {
                    if (
                        matchResponse.coefficientWin2 < matchResponse.coefficientDraw &&
                        matchResponse.coefficientWin2 < matchResponse.coefficientWin1
                    ) { countOfPredictedResults++; } else { countOfUnpredictedResults++; }
                }

                const teamName1: string = teams.find(t => t.id === match.teamHomeId).name;
                const teamName2: string = teams.find(t => t.id === match.teamGuestId).name;
                console.log(`win1: ${matchResponse.coefficientWin1}`);
                console.log(`draw: ${matchResponse.coefficientDraw}`);
                console.log(`win2: ${matchResponse.coefficientWin2}`);
                console.log(`${teamName1} ${match.homeGoals} : ${match.guestGoals} ${teamName2}`);
            });
        });

        it("Check success of predicted result", async () => {
            console.log(`Percentage of Match's predicting is ${countOfPredictedResults / matchesOfLastRound.length}`);
        });

        after("Delete Team Statistic", async () => {
            await deleteFootballSet(
                matches.map(match => match.id),
                categoryId,
                teams.map(team => team.id)
            );
        });
    });
});