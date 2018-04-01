/**
 * Category of match [For example: Champions League, Premier League, etc.]
 */
export interface MatchCategory {
    id: string;
    name: string;
    description?: string;
    isContinental: boolean;
    country?: string;
    isFinished: boolean;
}