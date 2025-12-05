"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { useAuth } from "@/contextos/ContextoAuth"
import type { Orden } from "@/lib/tipos"
import { formatearPrecio } from "@/lib/utilidades"

export default function PaginaPedidos() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!autenticado) {
      router.push("/login")
      return
    }

    if (usuario) {
      cargarPedidos()
    }
  }, [autenticado, usuario, router])

  const cargarPedidos = async () => {
    if (!usuario) return

    try {
      const response = await fetch(`/api/ordenes/usuario/${usuario.id}`, {
        cache: "no-store",
        credentials: "include",
      })

      if (response.ok) {
        const ordenesData: Orden[] = await response.json()
        // Ordenar por fecha de creación descendente
        const ordenesOrdenadas = ordenesData.sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
        )
        setOrdenes(ordenesOrdenadas)
      } else {
        console.error("[v0] Error cargando pedidos")
      }
    } catch (error) {
      console.error("[v0] Error en fetch de pedidos:", error)
    } finally {
      setCargando(false)
    }
  }

  if (!autenticado || !usuario) {
    return null
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-secondary text-secondary-foreground"
      case "procesando":
        return "bg-primary text-primary-foreground"
      case "enviado":
        return "bg-primary text-primary-foreground"
      case "entregado":
        return "bg-primary text-primary-foreground"
      case "cancelado":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/mi-cuenta">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Mi Cuenta
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-8">Mis Pedidos</h1>

          {cargando ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Cargando pedidos...</p>
            </div>
          ) : ordenes.length > 0 ? (
            <div className="space-y-4">
              {ordenes.map((orden) => (
                <Card key={orden.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Orden #{orden.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(orden.fechaCreacion).toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge className={obtenerColorEstado(orden.estado)}>
                        {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      {orden.items.slice(0, 2).map((item) => (
                        <div key={item.productoId} className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={
                                item.imagenProducto?.startsWith("http") || item.imagenProducto?.startsWith("/")
                                  ? item.imagenProducto
                                  : `http://127.0.0.1:8090/api/files/productos/${item.productoId}/${item.imagenProducto}`
                              }
                              alt={item.nombreProducto || "Producto"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold line-clamp-1">
                              {item.nombreProducto || "Producto no disponible"}
                            </h4>
                            <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                          </div>
                          <p className="font-semibold">{formatearPrecio(item.precio * item.cantidad)}</p>
                        </div>
                      ))}
                      {orden.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">+ {orden.items.length - 2} productos más</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="font-semibold">Total:</span>
                      <span className="text-xl font-bold text-primary">{formatearPrecio(orden.total)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No tienes pedidos</h2>
              <p className="text-muted-foreground mb-6">Cuando realices un pedido aparecerá aquí</p>
              <Link href="/productos">
                <Button>Explorar Productos</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
