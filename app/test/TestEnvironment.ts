import * as requestPromise from "request-promise";
import {RequestAPI, RequiredUriUrl} from "request";
import {RequestPromise, RequestPromiseOptions} from "request-promise";

type Request = RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>;

/*
    No detach requestPromiseOption logic into separate const variable (because we should use different 'jar' objects)
 */

export const user1: Request = requestPromise.defaults({
    json: true,
    simple: false,
    transform: (body, response) => response,
    baseUrl: "http://localhost:8080",
    jar: requestPromise.jar()
});
export const admin: Request = requestPromise.defaults({
    json: true,
    simple: false,
    transform: (body, response) => response,
    baseUrl: "http://localhost:8080",
    jar: requestPromise.jar()
});