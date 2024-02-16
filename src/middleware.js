import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res

    //return NextResponse.redirect(new URL('/home', request.url));
    
    /* THIS IS VERY MESSY DISREGARD 
    const { pathname } = request.nextUrl;

    // Check if the pathname is already '/home', if so, do nothing
    if (pathname === '/home') {
        return NextResponse.next();
    }

    // For all other paths, redirect to '/home'
    return NextResponse.redirect(new URL('/home', request.url));
    */
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * Feel free to modify this pattern to include more paths.
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }