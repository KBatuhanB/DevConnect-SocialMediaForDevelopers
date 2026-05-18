import { type NextRequest } from "next/server";
import { proxyApiRequest } from "@web/lib/proxy-api";

function readAuthPath(params: { path?: string[] }) {
  return `/auth/${(params.path ?? []).join("/")}`;
}

export async function GET(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyApiRequest(request, readAuthPath(context.params));
}

export async function POST(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyApiRequest(request, readAuthPath(context.params));
}

export async function DELETE(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyApiRequest(request, readAuthPath(context.params));
}

export async function PATCH(request: NextRequest, context: { params: { path?: string[] } }) {
  return proxyApiRequest(request, readAuthPath(context.params));
}