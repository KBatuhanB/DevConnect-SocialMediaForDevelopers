"use client";

import { useQuery } from "@tanstack/react-query";
import { getViewerProfile } from "./api";
import { viewerFeatureConfig } from "./config";

export function useViewerProfileQuery() {
  return useQuery({
    queryKey: viewerFeatureConfig.queryKeys.me,
    queryFn: getViewerProfile
  });
}