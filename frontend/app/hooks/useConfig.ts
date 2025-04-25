import { useOutletContext } from "@remix-run/react";
import type { ApplicationConfig } from "~/config";

export function useConfig(): ApplicationConfig {
  return useOutletContext<{ config: ApplicationConfig }>().config;
}
