declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_HOSTNAME?: string;
    DATABASE_NAME?: string;
    DATABASE_PORT?: string;
    DATABASE_PASSWORD?: string;
    DATABASE_USERNAME?: string;
    COOKIE_SECRET: string;
  }
}
