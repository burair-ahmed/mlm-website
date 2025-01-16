import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Extract token from cookies
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Redirect to homepage if no token is found
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Allow the request to proceed to the protected route
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'], // Protect the dashboard route
};
