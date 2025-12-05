"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import Link from "next/link"
import { formatearPrecio } from "@/lib/utilidades"

export default function PaginaAdminDashboard() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    numeroOrdenes: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    productosBajoStock: 0,
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }

    cargarEstadisticas()
  }, [autenticado, usuario, router])

  const cargarEstadisticas = async () => {
    try {
      const [resOrdenes, resProductos, resUsuarios] = await Promise.all([
        fetch("/api/ordenes"),
        fetch("/api/productos"),
        fetch("/api/usuarios")
      ])

      if (resOrdenes.ok && resProductos.ok) {
        const ordenes = await resOrdenes.json()
        const productos = await resProductos.json()
        const usuarios = resUsuarios.ok ? await resUsuarios.json() : []

        const totalVentas = ordenes.reduce((sum: number, orden: any) => sum + orden.total, 0)
        const productosBajoStock = productos.filter((p: any) => p.stock < 10 && p.activo).length

        setEstadisticas({
          totalVentas,
          numeroOrdenes: ordenes.length,
          totalProductos: productos.filter((p: any) => p.activo).length,
          totalUsuarios: Array.isArray(usuarios) ? usuarios.length : 0,
          productosBajoStock,
        })
      }
    } catch (error) {
      console.error("[v0] Error cargando estadísticas:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!autenticado || usuario?.rol !== "admin") {
    return null
  }

  if (cargando) {
    return (
      <>
        <NavegacionAdmin />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Resumen general de tu tienda</p>
          </div>

          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link href="/admin/reportes">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatearPrecio(estadisticas.totalVentas)}</div>
                  <p className="text-xs text-muted-foreground">De {estadisticas.numeroOrdenes} órdenes</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/ordenes">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estadisticas.numeroOrdenes}</div>
                  <p className="text-xs text-muted-foreground">Total de pedidos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/productos">
              <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estadisticas.totalProductos}</div>
                  <p className="text-xs text-muted-foreground">Productos activos</p>
                </CardContent>
              </Card>
            </Link>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estadisticas.totalUsuarios}</div>
                <p className="text-xs text-muted-foreground">Clientes con pedidos</p>
              </CardContent>
            </Card>
          </div>

          {/* Alerta de stock bajo */}
          {estadisticas.productosBajoStock > 0 && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">Productos con Stock Bajo</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Hay {estadisticas.productosBajoStock} producto(s) con menos de 10 unidades en stock
                    </p>
                    <a
                      href="/admin/productos?filtro=bajo-stock"
                      className="text-sm text-primary hover:underline font-semibold"
                    >
                      Ver productos críticos →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
