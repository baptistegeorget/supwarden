import { NextRequest } from "next/server"
import { getAuthUser } from "@/lib/actions"

export async function middleware(request: NextRequest) {
  // const authUser = await getAuthUser()

  // if (!authUser && (
  //   request.nextUrl.pathname === "/" ||
  //   request.nextUrl.pathname === "/settings"
  // )) {
  //   return Response.redirect(new URL("/signin", request.url))
  // }

  // if (authUser) {

  // }
}