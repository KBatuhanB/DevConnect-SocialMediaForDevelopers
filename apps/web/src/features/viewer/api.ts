import { apiRequest } from "@web/lib/api-client";
import { viewerFeatureConfig } from "./config";
import type { ViewerProfile } from "./types";

export async function getViewerProfile() {
  const payload = await apiRequest<{ profile: ViewerProfile }>(viewerFeatureConfig.api.mePath, {
    method: "GET"
  });

  return payload.profile;
}