import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

function unauthorized() {
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dashboard", charset="UTF-8"',
    },
  })
}

export function middleware(request: NextRequest) {
  const username = process.env.DASHBOARD_USERNAME
  const password = process.env.DASHBOARD_PASSWORD

  if (!username || !password) return NextResponse.next()

  const authHeader = request.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return unauthorized()

  const base64Credentials = authHeader.slice("Basic ".length).trim()
  let credentials = ""
  try {
    credentials = atob(base64Credentials)
  } catch {
    return unauthorized()
  }

  const [user, pass] = credentials.split(":")
  if (user !== username || pass !== password) return unauthorized()

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}

