"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, User, Menu, X, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contextos/ContextoAuth"
import { useCarrito } from "@/contextos/ContextoCarrito"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function NavegacionPublica() {
  const pathname = usePathname()
  const { usuario, autenticado, cerrarSesion } = useAuth()
  const { items } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const esRutaActiva = (ruta: string) => {
    if (ruta === "/") return pathname === "/"
    return pathname.startsWith(ruta)
  }

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  const handleCerrarSesion = () => {
    cerrarSesion()
    window.location.href = "/"
  }

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🌱</div>
            <span className="text-xl font-bold text-foreground">Huerto Hogar</span>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${esRutaActiva("/") && pathname === "/" ? "text-primary" : "text-foreground"
                }`}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className={`text-sm font-medium transition-colors hover:text-primary ${esRutaActiva("/productos") ? "text-primary" : "text-foreground"
                }`}
            >
              Productos
            </Link>


            <Link
              href="/nosotros"
              className={`text-sm font-medium transition-colors hover:text-primary ${esRutaActiva("/nosotros") ? "text-primary" : "text-foreground"
                }`}
            >
              Nosotros
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors hover:text-primary ${esRutaActiva("/blog") ? "text-primary" : "text-foreground"
                }`}
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className={`text-sm font-medium transition-colors hover:text-primary ${esRutaActiva("/contacto") ? "text-primary" : "text-foreground"
                }`}
            >
              Contacto
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {autenticado && usuario ? (
              <>
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <User className="h-4 w-4" />
                        <span>{usuario.nombre}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">
                          {usuario.nombre} {usuario.apellido}
                        </p>
                        <p className="text-xs text-muted-foreground">{usuario.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/mi-cuenta" className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          Mi Cuenta
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mi-cuenta/pedidos" className="cursor-pointer">
                          <Package className="h-4 w-4 mr-2" />
                          Mis Pedidos
                        </Link>
                      </DropdownMenuItem>
                      {usuario.rol === "admin" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer">
                              Panel Admin
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/api-docs" className="cursor-pointer">
                              API Docs
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleCerrarSesion} className="cursor-pointer text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Iniciar Sesión</Button>
              </Link>
            )}

            {/* Botón Menú Móvil */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuAbierto(!menuAbierto)}>
              {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Menú Móvil */}
        {menuAbierto && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMenuAbierto(false)}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMenuAbierto(false)}
            >
              Productos
            </Link>


            <Link
              href="/nosotros"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMenuAbierto(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMenuAbierto(false)}
            >
              Blog
            </Link>
            <Link
              href="/contacto"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMenuAbierto(false)}
            >
              Contacto
            </Link>

            <div className="border-t border-border pt-4 mt-4">
              {autenticado && usuario ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">{usuario.email}</p>
                  </div>
                  <Link
                    href="/mi-cuenta"
                    className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Mi Cuenta
                  </Link>
                  <Link
                    href="/mi-cuenta/pedidos"
                    className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                    onClick={() => setMenuAbierto(false)}
                  >
                    Mis Pedidos
                  </Link>
                  {usuario.rol === "admin" && (
                    <>
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                        onClick={() => setMenuAbierto(false)}
                      >
                        Panel Admin
                      </Link>
                      <Link
                        href="/api-docs"
                        className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
                        onClick={() => setMenuAbierto(false)}
                      >
                        API Docs
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleCerrarSesion()
                      setMenuAbierto(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
