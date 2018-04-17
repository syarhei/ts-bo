
export class TeamError extends Error {
    public statusCode: number = 0;
    constructor(message: string, statusCode: number = 0) {
        super(message);
        this.statusCode = statusCode;
    }
}