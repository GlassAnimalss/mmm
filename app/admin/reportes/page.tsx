"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Package, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import { formatearPrecio } from "@/lib/utilidades"

export default function PaginaAdminReportes() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [reportes, setReportes] = useState({
    ventasTotales: 0,
    promedioOrden: 0,
    productosVendidos: 0,
    clientesActivos: 0,
    productoMasVendido: { nombre: "", cantidad: 0 },
  })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }

    cargarReportes()
  }, [autenticado, usuario, router])

  const cargarReportes = async () => {
    try {
      const [resOrdenes, resProductos] = await Promise.all([fetch("/api/ordenes"), fetch("/api/productos")])

      if (resOrdenes.ok && resProductos.ok) {
        const ordenes = await resOrdenes.json()
        const productos = await resProductos.json()

        const ventasTotales = ordenes.reduce((sum: number, orden: any) => sum + orden.total, 0)
        const promedioOrden = ordenes.length > 0 ? ventasTotales / ordenes.length : 0

        // Calcular productos vendidos
        const productosVendidosMap: Record<string, number> = {}
        let totalProductosVendidos = 0
        ordenes.forEach((orden: any) => {
          orden.items.forEach((item: any) => {
            totalProductosVendidos += item.cantidad
            if (!productosVendidosMap[item.productoId]) {
              productosVendidosMap[item.productoId] = 0
            }
            productosVendidosMap[item.productoId] += item.cantidad
          })
        })

        // Encontrar producto más vendido
        let productoMasVendido = { nombre: "N/A", cantidad: 0 }
        Object.entries(productosVendidosMap).forEach(([productoId, cantidad]) => {
          if (cantidad > productoMasVendido.cantidad) {
            const producto = productos.find((p: any) => p.id === productoId)
            if (producto) {
              productoMasVendido = { nombre: producto.nombre, cantidad }
            }
          }
        })

        // Clientes activos (con al menos un pedido)
        const clientesConPedidos = new Set(ordenes.map((o: any) => o.usuarioId))

        setReportes({
          ventasTotales,
          promedioOrden,
          productosVendidos: totalProductosVendidos,
          clientesActivos: clientesConPedidos.size,
          productoMasVendido,
        })
      }
    } catch (error) {
      console.error("[v0] Error cargando reportes:", error)
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
          <p className="text-muted-foreground">Cargando reportes...</p>
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Reportes</h1>
            <p className="text-muted-foreground">Análisis y estadísticas de tu tienda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{formatearPrecio(reportes.ventasTotales)}</div>
                <p className="text-xs text-muted-foreground mt-1">Ingresos totales generados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Promedio por Orden</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{formatearPrecio(reportes.promedioOrden)}</div>
                <p className="text-xs text-muted-foreground mt-1">Ticket promedio de compra</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reportes.productosVendidos}</div>
                <p className="text-xs text-muted-foreground mt-1">Unidades totales vendidas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reportes.clientesActivos}</div>
                <p className="text-xs text-muted-foreground mt-1">Con al menos un pedido</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Producto Más Vendido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{reportes.productoMasVendido.nombre}</p>
                  <p className="text-muted-foreground">Producto líder en ventas</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{reportes.productoMasVendido.cantidad}</p>
                  <p className="text-sm text-muted-foreground">unidades</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
