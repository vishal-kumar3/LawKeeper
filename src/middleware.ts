import { NextRequest, NextResponse } from 'next/server';
import subdomains from './subdomain.json';
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, loggedUserRoutes, publicRoutes, restrictedRoutes, subdomainsAuthRoutes } from './routes';
import { auth } from './auth';

export const config = {
  matcher: [
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ]
}

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const session = await auth()
  const isLoggedIn = !!session

  console.log("Route:- ", url.pathname)
  console.log("isLoggedIn:- ", isLoggedIn)

  const isApiAuthRoute = url.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(url.pathname);
  const isAuthRoute = authRoutes.includes(url.pathname);
  const isSubdomainAuthRoute = subdomainsAuthRoutes.includes(url.pathname)
  const isRestrictedRoute = restrictedRoutes.includes(url.pathname)
  const isStaticFile = url.pathname.startsWith("/public") || url.pathname.startsWith("/images")

  const allowedDomains = ["localhost:3000"]

  const isAllowedDomain = allowedDomains.some(domain => hostname?.includes(domain))
  const subdomain = hostname?.split(".")[0]
  const subdomainData = subdomains.find(sub => sub.subdomain === subdomain)
  console.log("Subdomain Data:- ", subdomainData?.subdomain)



  if (isApiAuthRoute || isStaticFile) {
    console.log("pathname:- ", url.pathname)
    return NextResponse.next()
  }
  if (isRestrictedRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (isAuthRoute) {
    console.log("AuthRoute")
    if (isLoggedIn) {
      console.log("LoggedIn")
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
    }
    return NextResponse.next()
  }

  if(isSubdomainAuthRoute && subdomainData){
    if(isLoggedIn) return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, req.url))
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  if (!isLoggedIn && subdomainData) {
    // console.log("url.req:- ", req.nextUrl)
    if (!session) return NextResponse.rewrite(new URL(`/`, req.url))
    // TODO: Need to implement role and subdomain for security
    console.log("Yo:- ", session)
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    // yaha subdomain route check lgega
    if (subdomains.some(sub => sub.subdomain === subdomain)) {
      return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}/auth`, req.url))
    }
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }


  if (isAllowedDomain && !subdomains.some(sub => sub.subdomain === subdomain)) {
    // If other subdomain is used instead of the allowed subdomains
    // dedirect them to the main domain (citizen)
    return NextResponse.rewrite(new URL(url.pathname, req.url))
  }

  if (isAllowedDomain && isLoggedIn && loggedUserRoutes.includes(url.pathname)) {
    return NextResponse.redirect("/")
  }


  if (subdomainData) {
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url))
  }

  return new Response(null, { status: 404 });
}
