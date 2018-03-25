import {argv} from "yargs";

const PRODUCTION: string = "production";
const LOCAL: string = "local";

export function getConfigEnvironment(): string {
    if (process.env.NODE_ENV === PRODUCTION)
        return PRODUCTION;
    if (process.env.BO_DEV_MACHINE) {
        const config: string = argv.config;
        switch (config) {
            case PRODUCTION:
                return PRODUCTION;
            default:
                return LOCAL;
        }
    }
    return LOCAL;
}