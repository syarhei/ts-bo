import {NextFunction, Request, Response} from "express";
import {RequestHandler} from "express-serve-static-core";
import * as colors from "colors/safe";

export function logRequestResponse(req: Request, res: Response, next: NextFunction): RequestHandler {
    console.log(`[${(colors.blue as any).bold(req.method)}]: ${req.path}`);
    res.end = new Proxy(res.end, {
        apply: ((target, thisArg, argArray) => {
            const status: string = res.statusCode.toString();
            if (status.startsWith("2") || status.startsWith("3")) {
                console.log(colors.bold(`    STATUS: ${(colors.green as any).bold(res.statusCode.toString())}`));
            } else if (status.startsWith("4") || status.startsWith("5")) {
                console.log(colors.bold(`    STATUS: ${(colors.red as any).bold(res.statusCode.toString())}`));
            }
            target.apply(thisArg, argArray);
        })
    });
    next();
    return;
}