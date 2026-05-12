export function isSupportedHealthPath(pathname: string): boolean {
  return pathname === "/health" || pathname === "/ready";
}