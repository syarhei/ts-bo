
export class MatchCategoryError extends Error {
    constructor(message: string, public statusCode: number = 0) {
        super(message);
    }
}