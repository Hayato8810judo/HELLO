import { nonNullable } from "~/utils/invariant";

export type ApplicationConfig = {
  API_BASE_URL: string;
};

export function getConfig(): ApplicationConfig {
  return {
    API_BASE_URL: nonNullable(process.env.API_BASE_URL),
  };
}
