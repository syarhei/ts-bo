import {NextFunction, Request, Response} from "express";
import {RequestHandler} from "express-serve-static-core";

export function logRequestResponse(req: Request, res: Response, next: NextFunction): RequestHandler {
    console.log(`[${req.method}]: ${req.path}`);
    res.end = new Proxy(res.end, {
        apply: ((target, thisArg, argArray) => {
            console.log(`    STATUS: ${res.statusCode}`);
            target.apply(thisArg, argArray);
        })
    });
    next();
    return;
}