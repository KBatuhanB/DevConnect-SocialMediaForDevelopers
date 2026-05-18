type ApiMeta = {
  requestId?: string;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: ApiMeta;
};

type ApiFailure = {
  success: false;
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
  };
};

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

function readFailurePayload<T>(payload: ApiEnvelope<T> | null) {
  return payload && payload.success === false ? payload.error : undefined;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly requestId?: string;

  constructor(status: number, message: string, code?: string, requestId?: string) {
    super(message);

    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

export function readApiErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  return "Islem su an tamamlanamadi.";
}

function buildRequestPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const requestPath = buildRequestPath(path);

  let response: Response;

  try {
    response = await fetch(requestPath, {
      ...init,
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {})
      }
    });
  } catch {
    throw new ApiClientError(
      0,
      "API'ye ulasilamadi. Vercel proxy ve Render WEB_ORIGIN ayarlarini kontrol et."
    );
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  const failure = readFailurePayload(payload);

  if (!response.ok || payload?.success === false) {
    throw new ApiClientError(
      response.status,
      failure?.message ?? "Islem su an tamamlanamadi.",
      failure?.code,
      failure?.requestId
    );
  }

  return payload?.data ?? ({} as T);
}