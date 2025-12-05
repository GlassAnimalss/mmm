import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Obtener el token de autenticación de las cookies
  const token = request.cookies.get("pb_auth")?.value

  // Rutas que requieren autenticación de admin
  const adminRoutes = [
    "/admin",
    "/admin/productos",
    "/admin/categorias",
    "/admin/ordenes",
    "/admin/usuarios",
    "/admin/blog",
    "/admin/reportes",
  ]

  // Rutas que requieren autenticación de usuario
  const protectedRoutes = ["/mi-cuenta", "/checkout", "/perfil", "/pago"]

  const pathname = request.nextUrl.pathname

  // Verificar si es una ruta de admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route))

  // Verificar si es una ruta protegida
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Si no hay token y la ruta requiere autenticación, redirigir al login
  if (!token && (isAdminRoute || isProtectedRoute)) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Si hay token, permitimos el paso.
  // La validación de rol específica se hará en cada página (client-side o server-side)
  // ya que el token JWT de PocketBase podría no contener el campo 'role' en el payload
  // dependiendo de la configuración.

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/mi-cuenta/:path*", "/checkout", "/perfil/:path*", "/pago/:path*"],
}