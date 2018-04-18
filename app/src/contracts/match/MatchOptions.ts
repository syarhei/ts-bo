
export interface MatchOptions {
    id: string;
    teamHomeId: string;
    teamGuestId: string;
    matchCategoryId: string;
    coefficientWin1?: number;
    coefficientDraw?: number;
    coefficientWin2?: number;
    place: string;
    date: number;
}