import { opsSmokeConfig } from "./config";

type SmokeResult = {
  target: string;
  path: string;
  ok: boolean;
  status: number;
  detail: string;
};

function readArgument(name: string) {
  const exactIndex = process.argv.findIndex((value) => value === name);

  if (exactIndex >= 0) {
    return process.argv[exactIndex + 1];
  }

  const prefixedValue = process.argv.find((value) => value.startsWith(`${name}=`));

  if (!prefixedValue) {
    return undefined;
  }

  return prefixedValue.slice(name.length + 1);
}

function readPositionalArgument(index: number) {
  const positionalValues = process.argv.slice(2).filter((value) => !value.startsWith("--"));

  return positionalValues[index];
}

function readBaseUrl(argumentName: string, envName: string) {
  const positionalIndex = argumentName === "--web-url" ? 0 : 1;
  const value = readArgument(argumentName) ?? readPositionalArgument(positionalIndex) ?? process.env[envName];

  if (!value) {
    throw new Error(`${argumentName} veya ${envName} zorunlu.`);
  }

  return value.replace(/\/$/, "");
}

function unwrapHealthPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  if ("success" in payload && "data" in payload) {
    return (payload as { data: { status?: string; service?: string } }).data;
  }

  return payload as { status?: string; service?: string };
}

async function fetchWithTimeout(url: string) {
  return fetch(url, {
    signal: AbortSignal.timeout(opsSmokeConfig.timeouts.requestMs)
  });
}

async function runHealthCheck(target: string, baseUrl: string, path: string, expectedService: string) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`);
  const payload = unwrapHealthPayload(await response.json());
  const ok = response.ok && payload?.status === "ok" && payload?.service === expectedService;

  return {
    target,
    path,
    ok,
    status: response.status,
    detail: ok ? "ok" : "Beklenen health cevabi alinamadi"
  } satisfies SmokeResult;
}

async function runPageCheck(target: string, baseUrl: string, path: string) {
  const response = await fetchWithTimeout(`${baseUrl}${path}`);
  const ok = response.ok;

  return {
    target,
    path,
    ok,
    status: response.status,
    detail: ok ? "ok" : "Beklenen sayfa cevabi alinamadi"
  } satisfies SmokeResult;
}

async function main() {
  const webUrl = readBaseUrl("--web-url", "OPS_SMOKE_WEB_URL");
  const apiUrl = readBaseUrl("--api-url", "OPS_SMOKE_API_URL");

  const checks = [
    ...opsSmokeConfig.web.healthPaths.map((path) =>
      runHealthCheck("web", webUrl, path, "devconnect-web")
    ),
    ...opsSmokeConfig.web.pagePaths.map((path) => runPageCheck("web", webUrl, path)),
    ...opsSmokeConfig.api.healthPaths.map((path) =>
      runHealthCheck("api", apiUrl, path, "devconnect-api")
    )
  ];

  // Faz 13 smoke adimi tek raporda gorunsun diye sonuclari toplu akitiyoruz.
  const results = await Promise.all(checks);
  console.table(results);

  if (results.every((result) => result.ok)) {
    console.log("Ops smoke basarili.");
    return;
  }

  process.exitCode = 1;
  throw new Error("Ops smoke basarisiz.");
}

void main();