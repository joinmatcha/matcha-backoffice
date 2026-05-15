import { NextResponse, type NextRequest } from "next/server"

const ADMIN_COOKIE_NAME = "admin_token"

export function proxy(request: NextRequest) {
  const hasAdminCookie = request.cookies.has(ADMIN_COOKIE_NAME)
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard")

  if (isDashboardPage && !hasAdminCookie) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && hasAdminCookie) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = "/dashboard"
    dashboardUrl.search = ""
    return NextResponse.redirect(dashboardUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
