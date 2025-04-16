import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { getToken } from 'next-auth/jwt';

const locales = ['ru', 'en', 'es'];
const defaultLocale = 'ru';

// Public paths that don't require authentication
const publicPaths = [
  '/',
  '/en',
  '/es',
  '/ru',
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/en/auth/login',
  '/en/auth/register',
  '/en/auth/error',
  '/es/auth/login',
  '/es/auth/register',
  '/es/auth/error',
  '/ru/auth/login',
  '/ru/auth/register',
  '/ru/auth/error',
  '/api',
  '/_next',
  '/images',
  '/favicon',
];

function getLocale(request: NextRequest): string {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Try to get locale from cookie first
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Fall back to accept-language header
  return match(languages, locales, defaultLocale);
}

function isPublicPath(path: string): boolean {
  // Check for root paths
  if (path === '/' || path === '/en' || path === '/es' || path === '/ru') {
    return true;
  }

  // Direct check for auth paths
  if (
    path.includes('/auth/login') ||
    path.includes('/auth/register') ||
    path.includes('/auth/error') ||
    path.includes('/auth/signin') ||
    path.includes('/auth/signup')
  ) {
    return true;
  }

  // Check for api routes
  if (path.startsWith('/api/')) {
    return true;
  }

  // Check other public paths
  return publicPaths.some((publicPath) => path.startsWith(publicPath));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static assets and API routes
  if (
    pathname.includes('.') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Handle locale determination
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  const locale = pathnameHasLocale ? pathname.split('/')[1] : getLocale(request);

  // Log for debugging
  console.log(`Path: ${pathname}, Locale detected: ${locale}, Has locale: ${pathnameHasLocale}`);

  // If root path, redirect to locale version
  if (pathname === '/') {
    console.log(`Redirecting from / to /${locale}`);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // If it's a locale root path, allow access without auth check
  if (locales.some((loc) => pathname === `/${loc}`)) {
    console.log(`Allowing access to locale root path: ${pathname}`);
    return NextResponse.next();
  }

  // Check for authentication token
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  console.log(`User authenticated: ${isAuthenticated}`);

  // Redirect authenticated users from login/register pages to home
  if (isAuthenticated) {
    console.log('User is authenticated, checking if on auth page:', pathname);

    // Check for exact paths to capture both base and localized auth routes
    const authPaths = ['/auth/login', '/auth/register', '/auth/signin', '/auth/signup'];

    // Add localized versions of auth paths
    locales.forEach((loc) => {
      authPaths.push(`/${loc}/auth/login`);
      authPaths.push(`/${loc}/auth/register`);
      authPaths.push(`/${loc}/auth/signin`);
      authPaths.push(`/${loc}/auth/signup`);
    });

    if (authPaths.includes(pathname)) {
      console.log('Redirecting authenticated user from auth page to home');
      // Redirect to home page with the correct locale
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Handle redirect for base auth paths to localized versions
  if (pathname === '/auth/login' || pathname === '/auth/signin') {
    return NextResponse.redirect(new URL(`/${defaultLocale}/auth/login`, request.url));
  }

  if (pathname === '/auth/register' || pathname === '/auth/signup') {
    // For register page, make sure we include any query params
    const registerUrl = new URL(`/${defaultLocale}/auth/register`, request.url);

    // Copy search params
    request.nextUrl.searchParams.forEach((value, key) => {
      registerUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(registerUrl);
  }

  if (pathname === '/auth/error') {
    return NextResponse.redirect(new URL(`/${defaultLocale}/auth/error`, request.url));
  }

  // Check if this is a public path before authentication check
  const isPublic = isPublicPath(pathname);
  console.log(`Path public check: ${pathname} is ${isPublic ? 'public' : 'not public'}`);

  // Check authentication for non-public paths
  if (!isAuthenticated && !isPublic) {
    console.log(`Non-authenticated user trying to access non-public path: ${pathname}`);

    // Special case to prevent redirect from register page to login
    if (pathname.includes('/auth/register') || pathname.includes('/auth/signup')) {
      return NextResponse.next();
    }

    // Redirect to login page with the correct locale
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);

    // Store the original URL as a query parameter for redirect after login
    const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search);
    loginUrl.searchParams.set('returnUrl', returnUrl);

    console.log(`Redirecting to login: ${loginUrl.toString()}`);
    return NextResponse.redirect(loginUrl);
  }

  // Handle locale redirect if needed
  if (!pathnameHasLocale && !pathname.startsWith('/auth/')) {
    const localizedUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
      request.url
    );

    // Preserve query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      localizedUrl.searchParams.set(key, value);
    });

    console.log(`Locale redirect to: ${localizedUrl.toString()}`);
    return NextResponse.redirect(localizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/en/auth/:path*',
    '/es/auth/:path*',
    '/ru/auth/:path*',
    '/auth/:path*',
  ],
};
