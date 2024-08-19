import { NextRequest, NextResponse } from "next/server";
import { asyncHandler } from "./helpers/asyncHandler";

export const middleware = asyncHandler(async (req: NextRequest) => {

    if(req.url.includes("signin") || req.url.includes("signup")) return NextResponse.next()
    
    const token: string | undefined = req.cookies.get("accessToken")?.value
    if(!token) return NextResponse.redirect(new URL("/signin", req.nextUrl))
    
    return NextResponse.next()
})

export const config = {
    matcher: [
      '/',
      '/login',
      '/signup'
    ]
  }