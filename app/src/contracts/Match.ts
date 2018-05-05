import {RESULTS_ENUM} from "./Bet";

export interface Match {
    id: string;
    teamHomeId: string;
    teamGuestId: string;
    matchCategoryId: string;
    coefficientWin1: number;
    coefficientDraw: number;
    coefficientWin2: number;
    place: string;
    date: number;
    result?: RESULTS_ENUM;
    homeGoals?: number;
    guestGoals?: number;
}