import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authFeatureConfig } from "@web/features/auth/config";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(authFeatureConfig.cookies.accessTokenName)?.value;

  if (!accessToken) {
    const url = request.nextUrl.clone();
    url.pathname = authFeatureConfig.paths.auth;
    url.searchParams.set("from", request.nextUrl.pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"]
};