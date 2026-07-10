import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

const ADMIN_COOKIE_NAME = "admin_token"

function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }

  const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL ?? "http"
  const host = process.env.NEXT_PUBLIC_API_HOST
  const port = process.env.NEXT_PUBLIC_API_PORT

  return `${protocol}://${host}:${port}`
}

async function proxy(request: NextRequest, path: string[]) {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json(
      { message: "Missing authentication token" },
      { status: 401 }
    )
  }

  const url = `${getApiBaseUrl()}/api/admin/${path.join("/")}${request.nextUrl.search}`
  const hasBody = !["GET", "HEAD"].includes(request.method)

  const apiResponse = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: hasBody ? await request.text() : undefined,
  })

  const data = await apiResponse.json().catch(() => null)
  return NextResponse.json(data, { status: apiResponse.status })
}

type RouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  return proxy(request, (await params).path)
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return proxy(request, (await params).path)
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return proxy(request, (await params).path)
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return proxy(request, (await params).path)
}
