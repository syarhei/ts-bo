
export class MatchError extends Error {
    public statusCode: number = null;
    constructor(message: string, statusCode: number = 0, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        if (stack) {
            this.stack = stack;
        }
    }
}