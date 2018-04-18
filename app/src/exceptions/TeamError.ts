
export class TeamError extends Error {
    constructor(message: string, public statusCode: number = 0) {
        super(message);
    }
}