import dotenv from "dotenv";
import { nonNullable } from "./utils/invariant";

export type ApplicationConfig = {
  APPLICATION_AUTH_CLAIM_PREFIX: string;
  JWT_CLAIM_SECRET: string,
  JWT_SESSION_SECRET: string,
};

let config: ApplicationConfig | null = null;

export function getConfig(): ApplicationConfig {
  if (config === null) {
    dotenv.config();
    config = {
      APPLICATION_AUTH_CLAIM_PREFIX: nonNullable(process.env.APPLICATION_AUTH_CLAIM_PREFIX),
      JWT_CLAIM_SECRET: nonNullable(process.env.JWT_CLAIM_SECRET),
      JWT_SESSION_SECRET: nonNullable(process.env.JWT_SESSION_SECRET)
    };
  }
  return config;
}
