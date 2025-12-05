"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import type { Orden } from "@/lib/tipos"
import { formatearPrecio } from "@/lib/utilidades"
import { useToast } from "@/hooks/use-toast"

export default function PaginaDetalleOrden() {
  const params = useParams()
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const { toast } = useToast()
  const [orden, setOrden] = useState<Orden | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }

    cargarOrden()
  }, [params.id, autenticado, usuario, router])

  const cargarOrden = async () => {
    try {
      const response = await fetch(`/api/ordenes/${params.id}`)

      if (response.ok) {
        const ordenData: Orden = await response.json()
        setOrden(ordenData)
      } else {
        toast({
          title: "Error",
          description: "Orden no encontrada",
          variant: "destructive",
        })
        router.push("/admin/ordenes")
      }
    } catch (error) {
      console.error("[v0] Error cargando orden:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  const actualizarEstado = async (nuevoEstado: string) => {
    if (orden) {
      try {
        const response = await fetch(`/api/ordenes/${orden.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orden,
            estado: nuevoEstado as Orden["estado"],
            fechaActualizacion: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          const ordenActualizada = await response.json()
          setOrden(ordenActualizada)
          toast({
            title: "Estado actualizado",
            description: `La orden ahora está ${nuevoEstado}`,
          })
        } else {
          toast({
            title: "Error",
            description: "No se pudo actualizar el estado",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[v0] Error actualizando estado:", error)
        toast({
          title: "Error",
          description: "Error de conexión con el servidor",
          variant: "destructive",
        })
      }
    }
  }

  const imprimirBoleta = () => {
    window.print()
  }

  if (!autenticado || usuario?.rol !== "admin") {
    return null
  }

  if (cargando) {
    return (
      <>
        <NavegacionAdmin />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Cargando orden...</p>
        </div>
      </>
    )
  }

  if (!orden) {
    return (
      <>
        <NavegacionAdmin />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Orden no encontrada</p>
        </div>
      </>
    )
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
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8 print:hidden">
            <Link href="/admin/ordenes">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Volver a Órdenes
              </Button>
            </Link>
            <Button variant="outline" onClick={imprimirBoleta} className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" /> Imprimir Boleta
            </Button>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">Orden #{orden.id}</h1>
              <Badge className={obtenerColorEstado(orden.estado)}>
                {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Creada el{" "}
              {new Date(orden.fechaCreacion).toLocaleDateString("es-CL", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Actualizar estado */}
          <Card className="mb-6 print:hidden">
            <CardHeader>
              <CardTitle>Actualizar Estado</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={orden.estado} onValueChange={actualizarEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="procesando">Procesando</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Información del cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Nombre</p>
                    <p className="font-semibold">
                      {orden.direccionEnvio.nombre} {orden.direccionEnvio.apellido}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                    <p>{orden.direccionEnvio.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dirección de Envío</p>
                    <p>{orden.direccionEnvio.direccion}</p>
                    <p>
                      {orden.direccionEnvio.ciudad}, {orden.direccionEnvio.region}
                    </p>
                    <p>CP: {orden.direccionEnvio.codigoPostal}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información del pago */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Método de Pago</p>
                    <p className="font-semibold capitalize">{orden.metodoPago}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subtotal</p>
                    <p>{formatearPrecio(orden.subtotal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Envío</p>
                    <p>{formatearPrecio(orden.envio)}</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold text-primary">{formatearPrecio(orden.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                        {formatearPrecio(item.precio)} x {item.cantidad}
                      </p>
                      <p className="text-sm font-semibold mt-1">{formatearPrecio(item.precio * item.cantidad)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
