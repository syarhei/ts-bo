import "colors";
import {NextFunction, Request, Response} from "express";
import {RequestHandler} from "express-serve-static-core";

// TODO: make log function as LogHandler class (with middleware getter)

export function logRequestResponse(req: Request, res: Response, next: NextFunction): RequestHandler {
    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log(`[${req.method.blue.bold}]: ${req.path}`);
    const str: string = "";
    res.json = new Proxy(res.json, {
        apply: (target, thisArg, argArray) => {
            const status: string = res.statusCode.toString();
            if (status.startsWith("4")) {
                console.log(`${"    ERROR:".magenta.bold} "${(argArray[0] as Error).message.magenta.bold}"`);
            }
            if (status.startsWith("5")) {
                console.log(`${thisArg[0]}`.cyan.bold);
            }
            target.apply(thisArg, argArray);
        }
    });
    res.end = new Proxy(res.end, {
        apply: ((target, thisArg, argArray) => {
            const status: string = res.statusCode.toString();
            if (status.startsWith("2") || status.startsWith("3")) {
                console.log(`    ${"STATUS:".bold} ${res.statusCode.toString().green.bold}`);
            } else if (status.startsWith("4") || status.startsWith("5")) {
                console.log(`    ${"STATUS:".bold} ${res.statusCode.toString().red.bold}`);
            }
            target.apply(thisArg, argArray);
        })
    });

    next();
    return;
}