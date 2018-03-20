

export interface IConfig {
    DATABASE_NAME: string;
    DATABASE_HOSTNAME: string;
    DATABASE_USER: string;
    DATABASE_DIALECT: string;
    JSON_WEB_TOKEN_EXPIRED_TIME: number
}

export interface IKey {
    DATABASE_PASSWORD: string;
    JSON_WEB_TOKEN_KEY: string;
}