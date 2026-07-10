export type QueryValue = string | number | boolean | null | undefined

export type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  query?: Record<string, QueryValue>
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
  }
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const params = new URLSearchParams()

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  })

  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers()

  if (options.body) {
    headers.set("Content-Type", "application/json")
  }

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(data?.message || "Erreur API", response.status)
  }

  return data as T
}
