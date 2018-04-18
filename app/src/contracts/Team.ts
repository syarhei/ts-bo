
export interface Team {
    id: string;
    name: string;
    owner: string;
    country: string;
    year: number;
    wins?: number;
    draws?: number;
    loses?: number;
}