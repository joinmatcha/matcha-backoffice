import { NextResponse } from "next/server"

const ADMIN_COOKIE_NAME = "admin_token"

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" })

  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    path: "/",
    maxAge: 0,
  })

  return response
}
