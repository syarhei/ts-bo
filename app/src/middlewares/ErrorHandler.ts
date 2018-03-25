import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {UserError} from "../models/exceptions/UserError";

export class ErrorHandler {
    constructor() {}

    static middleware(err: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        if (err instanceof UserError) {
            const code: number = 400 + err.statusCode;
            res.status(code).json({ message: err.message });
        } else {
            console.log(err);
            res.status(500).end();
        }
        return;
    }
}