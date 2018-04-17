import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {UserError} from "../models/exceptions/UserError";
import {TeamError} from "../models/exceptions/TeamError";
import {AuthError} from "../models/exceptions/AuthError";

export class ErrorHandler {
    constructor() {}

    static middleware(err: any, req: Request, res: Response, next: NextFunction): ErrorRequestHandler {
        if (err instanceof AuthError) {
            switch (err.statusCode) {
                case 1:
                    res.status(401).json({ message: err.message });
                    break;
                case 2:
                    res.status(403).json({ message: err.message });
                    break;
                default:
                    console.log(`Unhandled TeamError: "${err.message}"`);
                    res.status(500).end();
            }
            return;
        }

        if (err instanceof UserError) {
            const code: number = 400 + err.statusCode;
            res.status(code).json({ message: err.message });
            return;
        }

        if (err instanceof TeamError) {
            switch (err.statusCode) {
                case 1:
                    res.status(404).json({ message: err.message });
                    break;
                default:
                    console.log(`Unhandled TeamError: "${err.message}"`);
                    res.status(500).end();
            }
            return;
        }

        res.status(500).end();
        console.log(err);
    }
}