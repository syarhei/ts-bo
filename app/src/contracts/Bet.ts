export enum RESULTS_ENUM {
    W1 = "W1", D = "D", W2 = "W2"
}

export interface Bet {
    id: string;
    matchId: string;
    userId: string;
    cost: number;
    result: RESULTS_ENUM;
    isFinished: boolean;
    difference: number;
}