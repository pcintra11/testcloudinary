import { NextResponse, type NextRequest } from 'next/server';

import { cls, dbgError, dbgX } from '@/libs/commom/dbg';

import { CorsWhitelist } from '@/libs/server/corsWhiteList';

import { isLocalHost } from '@/appBase/commom/envs';
import { apisBase } from './appBase/commom/endPoints';

const corsOptions: {
  allowedMethods: string[];
  allowedOrigins: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  maxAge?: number;
  credentials: boolean;
} = {
  //MAX_AGE="86400" # 60 * 60 * 24 = 24 hours
  allowedMethods: (process.env?.ALLOWED_METHODS || "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS").split(","),
  allowedOrigins: CorsWhitelist(),
  allowedHeaders: (process.env?.ALLOWED_HEADERS || "Content-Type, Authorization").split(","),
  exposedHeaders: (process.env?.EXPOSED_HEADERS || "").split(","),
  maxAge: process.env?.MAX_AGE && parseInt(process.env?.MAX_AGE) || undefined, // 60 * 60 * 24 * 30, // 30 days
  credentials: true, //@!!!!!!!!! testar false e acesso a cookies
};

// Middleware
// ========================================================
// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  //csd('middleware', req.nextUrl, apisBase.corsDenied.apiPath);
  if (req.nextUrl.pathname == apisBase.corsDenied.pathname) {
    //csd('bypass middleware', req.nextUrl);
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // csd('middleware headers', request.headers);

  // Allowed origins check
  const origin = req.headers.get('origin'); // req.nextUrl.origin pode ser usado paa GET ???
  //csd('middleware origin', origin);

  let allowed: string | null = null;

  if (isLocalHost())
    allowed = 'localHost';
  else if (corsOptions.allowedOrigins.includes('*'))
    allowed = '*allOrigins*';
  else if (origin == null)
    allowed = 'serverCall?'; // testar outras situações, como chamada direta !!!!!!!!!!!!!!!
  else if (corsOptions.allowedOrigins.includes(origin))
    allowed = 'whitelist';

  // if (req.nextUrl.pathname == apisApp.funcsAdm.apiPath) {
  //   //csd('middleware block', req.nextUrl);
  //   allowed = null;
  // }

  if (allowed == null) {
    dbgError('middleware', `origin '${allowed}' not allowed for ${req.nextUrl.pathname}`);
    if (req.method !== 'POST')
      dbgError('middleware', 'não previsto method diferente de POST para CORS (origin não passado)', req.nextUrl.pathname);
    // https://reqbin.com/req/yxgi232e/get-request-with-cors-headers#:~:text=To%20send%20a%20GET%20request,than%20the%20destination%20server%20address.
    //return Response.json({ value: { msg: `middleware-CORS denied origin '${origin}'` } }, { status: HttpStatusCode.forbidden });
    //csd('nextUrl', req.nextUrl);
    req.nextUrl.searchParams.set('origin', origin || 'origin null');
    req.nextUrl.searchParams.set('pathname', req.nextUrl.pathname);
    req.nextUrl.pathname = apisBase.corsDenied.pathname;
    return NextResponse.redirect(req.nextUrl);
  }

  response.headers.set('Access-Control-Allow-Origin', origin || ''); //@!!!!!!!!!!!

  dbgX(1, 'middleware-CORS', `CORS allow origin '${origin}' (${allowed})`);

  // Set default CORS headers
  response.headers.set("Access-Control-Allow-Credentials", corsOptions.credentials.toString());
  response.headers.set("Access-Control-Allow-Methods", corsOptions.allowedMethods.join(","));
  response.headers.set("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  response.headers.set("Access-Control-Expose-Headers", corsOptions.exposedHeaders.join(","));
  response.headers.set("Access-Control-Max-Age", corsOptions.maxAge?.toString() ?? "");
  //response.json({ value: { message: 'ok'}});

  // Return
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/apis/:path*',
};