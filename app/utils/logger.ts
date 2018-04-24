import "colors";
import {NextFunction, Request, Response} from "express";
import {RequestHandler} from "express-serve-static-core";

export function logRequestResponse(req: Request, res: Response, next: NextFunction): RequestHandler {
    console.log(`[${req.method.blue.bold}]: ${req.path}`);
    const str: string = "";
    res.end = new Proxy(res.end, {
        apply: ((target, thisArg, argArray) => {
            const status: string = res.statusCode.toString();
            if (status.startsWith("2") || status.startsWith("3")) {
                console.log(`    ${"STATUS:".bold} ${res.statusCode.toString().green.bold}`);
            } else if (status.startsWith("4") || status.startsWith("5")) {
                if (status.startsWith("4")) {
                    const errorMessage: string = `${"    ERROR:".red.bold} ${(thisArg as Error).message.bold}`;
                    console.log(errorMessage);
                }
                console.log(`    ${"STATUS:".bold} ${res.statusCode.toString().green.bold}`);
            }
            target.apply(thisArg, argArray);
        })
    });
    next();
    return;
}