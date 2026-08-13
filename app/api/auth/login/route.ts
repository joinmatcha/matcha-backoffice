import { NextRequest, NextResponse } from "next/server"

const ADMIN_COOKIE_NAME = "admin_token"

function getExternalLoginUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`
  }

  const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL ?? "http"
  const host = process.env.NEXT_PUBLIC_API_HOST
  const port = process.env.NEXT_PUBLIC_API_PORT
  return `${protocol}://${host}:${port}/api/admin/auth/login`
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const apiResponse = await fetch(getExternalLoginUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const data = await apiResponse.json().catch(() => null)

  if (!apiResponse.ok) {
    return NextResponse.json(data, { status: apiResponse.status })
  }

  const setCookieHeader = apiResponse.headers.get("set-cookie")
  const tokenMatch = setCookieHeader?.match(/admin_token=([^;]+)/)
  const token = tokenMatch?.[1]

  if (!token) {
    return NextResponse.json({ message: "Token non reçu" }, { status: 500 })
  }

  const response = NextResponse.json(data)
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  })

  return response
}
