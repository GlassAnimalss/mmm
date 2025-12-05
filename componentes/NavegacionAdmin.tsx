"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  BarChart3,
  LogOut,
  Menu,
  X,
  Store,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contextos/ContextoAuth"
import { useState } from "react"

export default function NavegacionAdmin() {
  const pathname = usePathname()
  const router = useRouter()
  const { cerrarSesion } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const esRutaActiva = (ruta: string) => {
    if (ruta === "/admin") return pathname === "/admin"
    return pathname.startsWith(ruta)
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    router.push("/")
  }

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/ordenes", icon: ShoppingBag, label: "Órdenes" },
    { href: "/admin/productos", icon: Package, label: "Productos" },
    { href: "/admin/categorias", icon: FolderTree, label: "Categorías" },
    { href: "/admin/usuarios", icon: Users, label: "Usuarios" },
    { href: "/admin/blog", icon: FileText, label: "Blog" },
    { href: "/admin/reportes", icon: BarChart3, label: "Reportes" },
  ]

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🌱</div>
            <div>
              <span className="text-lg font-bold text-foreground">Admin</span>
              <span className="text-xs text-muted-foreground block">Huerto Hogar</span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant={esRutaActiva(item.href) ? "secondary" : "ghost"} size="sm" className="gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 ml-2">
                <Store className="h-4 w-4" />
                Volver a la Tienda
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleCerrarSesion} className="gap-2">
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>

          {/* Botón Menú Móvil */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuAbierto(!menuAbierto)}>
            {menuAbierto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menú Móvil */}
        {menuAbierto && (
          <div className="md:hidden py-4 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuAbierto(false)}>
                <Button
                  variant={esRutaActiva(item.href) ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link href="/" onClick={() => setMenuAbierto(false)}>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                <Store className="h-4 w-4" />
                Volver a la Tienda
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleCerrarSesion} className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
