import {ErrorRequestHandler, NextFunction, Request, Response} from "express";
import {UserError} from "../models/exceptions/UserError";
import {TeamError} from "../models/exceptions/TeamError";
import {AuthError} from "../models/exceptions/AuthError";
import {MatchError} from "../models/exceptions/MatchError";

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
            switch (err.statusCode) {
                case 0:
                    res.status(400).json({ message: err.message });
                    break;
                case 1:
                    res.status(404).json({ message: err.message });
                    break;
                default:
                    console.log(`Unhandled MatchError: "${err.message}"`);
                    res.status(500).end();
            }
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

        if (err instanceof MatchError) {
            switch (err.statusCode) {
                case 1:
                    res.status(404).json({ message: err.message });
                    break;
                case 2:
                    res.status(409).json({ message: err.message });
                    break;
                default:
                    console.log(`Unhandled MatchError: "${err.message}"`);
                    res.status(500).end();
            }
            return;
        }

        res.status(500).end();
        console.log(err);
    }
}