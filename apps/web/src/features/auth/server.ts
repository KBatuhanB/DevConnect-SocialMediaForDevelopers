import { cookies } from "next/headers";
import { authFeatureConfig } from "./config";

export function getServerAccessToken() {
  return cookies().get(authFeatureConfig.cookies.accessTokenName)?.value ?? null;
}

export function hasServerSession() {
  return getServerAccessToken() !== null;
}