import { redirect } from "next/navigation";
import { authFeatureConfig } from "../features/auth/config";
import { hasServerSession } from "../features/auth/server";

export default function HomePage() {
  redirect(hasServerSession() ? authFeatureConfig.paths.dashboard : authFeatureConfig.paths.auth);
}