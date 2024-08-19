import { NextRequest, NextResponse } from 'next/server';
import subdomains from './subdomain.json';
import { asyncHandler } from "./helpers/asyncHandler";

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ]
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");


  const allowedDomains = ["localhost:3000"]

  const isAllowedDomain = allowedDomains.some(domain => hostname?.includes(domain))
  const subdomain = hostname?.split(".")[0]

  if (isAllowedDomain && !subdomains.some(sub => sub.subdomain === subdomain)){
    console.log("Subdomain not found", url.pathname, req.url)
    return NextResponse.rewrite(new URL(url.pathname, req.url))
  }

  const subdomainData = subdomains.find(sub => sub.subdomain === subdomain)
  if(subdomainData){
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  return new Response(null, {status: 404});
}
