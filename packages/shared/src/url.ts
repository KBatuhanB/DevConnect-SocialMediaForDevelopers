export function createAbsoluteUrl(baseUrl: string, pathname: string): string {
  return new URL(pathname, baseUrl).toString();
}