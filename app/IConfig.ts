

export interface IConfig {
    DATABASE_NAME: string;
    DATABASE_HOSTNAME: string;
    DATABASE_USER: string;
    DATABASE_DIALECT: string;
    JSON_WEB_TOKEN_EXPIRED_TIME: number;
    APPLICATION_BET_PROFIT: number;
    MAHER_POISSON_HOME_PLACE_COEFFICIENT: number;
    MAHER_POISSON_TABLE_SIZE: number
}

export interface IKey {
    DATABASE_PASSWORD: string;
    JSON_WEB_TOKEN_KEY: string;
}