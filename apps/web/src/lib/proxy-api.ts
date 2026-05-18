import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

const backendBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function readBackendBaseUrl() {
  if (!backendBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL tanimli olmali.");
  }

  return backendBaseUrl.replace(/\/$/, "");
}

function filterRequestHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("accept-encoding");
  return headers;
}

function filterResponseHeaders(response: globalThis.Response) {
  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("transfer-encoding");
  headers.delete("connection");
  headers.delete("keep-alive");
  headers.delete("set-cookie");
  return headers;
}

function readCookieHeader() {
  const cookieStore = cookies();
  return cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");
}

export async function proxyApiRequest(request: NextRequest, pathname: string) {
  const backendUrl = new URL(pathname + request.nextUrl.search, readBackendBaseUrl());
  const method = request.method.toUpperCase();
  const headers = filterRequestHeaders(request);
  const cookieHeader = readCookieHeader();

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  const init: RequestInit = {
    method,
    headers,
    cache: "no-store"
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(backendUrl, init);
  const headersToSend = filterResponseHeaders(response);
  const setCookie = response.headers.get("set-cookie");

  if (setCookie) {
    headersToSend.append("set-cookie", setCookie);
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: headersToSend
  });
}