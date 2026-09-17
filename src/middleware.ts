import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtEdge } from '@/lib/jwt-edge';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;
  const secret = process.env.JWT_SECRET;

  let isValidSession = false;
  if (token && secret) {
    const result = await verifyJwtEdge(token, secret);
    isValidSession = result.valid;
  }

  // Si intenta acceder a /admin/login con sesión activa y válida, redirigir al dashboard
  if (pathname === '/admin/login' && isValidSession) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Rutas protegidas dentro de /admin (excepto el login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isValidSession) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      // Si el token era inválido o corrupto, lo eliminamos para evitar bucles
      if (token) {
        response.cookies.delete('auth_token');
      }
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
