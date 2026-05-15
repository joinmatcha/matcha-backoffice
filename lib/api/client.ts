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

function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL ?? "http"
  const host = process.env.NEXT_PUBLIC_API_HOST
  const port = process.env.NEXT_PUBLIC_API_PORT

  if (!host || !port) return null

  return `${protocol}://${host}:${port}`
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const apiBaseUrl = getApiBaseUrl()

  if (!apiBaseUrl) {
    throw new ApiError("Configuration API manquante")
  }

  const url = new URL(path, apiBaseUrl)

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
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
