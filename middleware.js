import { NextResponse } from 'next/server';

// Function to check for authentication and redirect if needed
export async function middleware(request) {
  const token = request.cookies.get('token');
  console.log('token', token);
  const isLogin = token == undefined ? false : true;
  if (isLogin == false) {
    return NextResponse.redirect(new URL('/', request.url)); // Redirect to home page if not logged in
  }

  return NextResponse.next(); // Allow the request to proceed
}

export const config = {
  matcher: ['/dashboard', '/artikels', '/categories', '/konselings', '/konselors', '/orders', '/users', '/videos'],
};
