"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Home, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { obtenerOrdenes } from "@/lib/datos-locales"
import type { Orden } from "@/lib/tipos"
import { formatearPrecio } from "@/lib/utilidades"

function ContenidoPagoCorrecto() {
  const searchParams = useSearchParams()
  const ordenId = searchParams.get("orden")
  const [orden, setOrden] = useState<Orden | null>(null)

  useEffect(() => {
    if (ordenId) {
      const ordenes = obtenerOrdenes()
      const ordenEncontrada = ordenes.find((o) => o.id === ordenId)
      if (ordenEncontrada) {
        setOrden(ordenEncontrada)
      }
    }
  }, [ordenId])

  if (!orden) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Mensaje de éxito */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">¡Pago Exitoso!</h1>
            <p className="text-xl text-muted-foreground mb-1">Tu orden ha sido confirmada</p>
            <p className="text-sm text-muted-foreground">
              Número de orden: <span className="font-semibold">#{orden.id}</span>
            </p>
          </div>

          {/* Detalles de la orden - Usar datos del snapshot */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Productos */}
              <div className="space-y-3">
                {orden.items.map((item) => (
                  <div key={item.productoId} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.imagenProducto || "/placeholder.svg"}
                        alt={item.nombreProducto || "Producto"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.nombreProducto || "Producto no disponible"}</h4>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.cantidad} {item.unidadProducto || "unidad"}(s)
                      </p>
                      <p className="text-sm font-semibold">{formatearPrecio(item.precio * item.cantidad)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{formatearPrecio(orden.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">{formatearPrecio(orden.envio)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatearPrecio(orden.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dirección de envío */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                {orden.direccionEnvio.nombre} {orden.direccionEnvio.apellido}
              </p>
              <p className="text-sm text-muted-foreground">{orden.direccionEnvio.direccion}</p>
              <p className="text-sm text-muted-foreground">
                {orden.direccionEnvio.ciudad}, {orden.direccionEnvio.region}
              </p>
              <p className="text-sm text-muted-foreground">CP: {orden.direccionEnvio.codigoPostal}</p>
              <p className="text-sm text-muted-foreground mt-2">Tel: {orden.direccionEnvio.telefono}</p>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="bg-muted rounded-lg p-6 mb-6">
            <div className="flex gap-3">
              <Package className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">¿Qué sigue?</h3>
                <p className="text-sm text-muted-foreground">
                  Recibirás un email de confirmación con los detalles de tu pedido. Nuestro equipo preparará tu orden y
                  la enviará en las próximas 24 horas. Podrás hacer seguimiento desde tu cuenta.
                </p>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Home className="h-4 w-4" /> Volver al Inicio
              </Button>
            </Link>
            <Link href="/mi-cuenta/pedidos" className="flex-1">
              <Button className="w-full gap-2">
                <Package className="h-4 w-4" /> Ver Mis Pedidos
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  )
}

export default function PaginaPagoCorrecto() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <ContenidoPagoCorrecto />
    </Suspense>
  )
}
