"use client"

import type React from "react"
import type { Producto, ItemOrden } from "@/lib/tipos"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { useCarrito } from "@/contextos/ContextoCarrito"
import { useAuth } from "@/contextos/ContextoAuth"
import {
  formatearPrecio,
  validarEmail,
  validarTelefonoChileno,
  formatearTelefonoChileno,
  regionesChile,
} from "@/lib/utilidades"


import { crearOrdenAPI } from "@/lib/api/ordenes"
import { actualizarProducto, obtenerProductosPorIds } from "@/lib/api/productos"
import Link from "next/link"

export default function PaginaCheckout() {
  const router = useRouter()
  const { items, total, limpiarCarrito } = useCarrito()
  const { usuario, autenticado } = useAuth()
  const { toast } = useToast()
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(false)
  const [datosCargados, setDatosCargados] = useState(false)
  const costoEnvio = 2990

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
    metodoPago: "tarjeta",
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito")
      return
    }

    const cargarProductos = async () => {
      const ids = items.map((item) => item.productoId)
      const prods = await obtenerProductosPorIds(ids)
      setProductos(prods)
    }

    cargarProductos()
  }, [items, router])

  useEffect(() => {
    if (autenticado && usuario && !datosCargados) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        ciudad: usuario.ciudad || "",
        region: usuario.region || "",
        codigoPostal: usuario.codigoPostal || "",
      }))
      setDatosCargados(true)
    }
  }, [usuario, autenticado, datosCargados])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    // Validaciones
    if (!validarEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    if (!validarTelefonoChileno(formData.telefono)) {
      toast({
        title: "Teléfono inválido",
        description: "Por favor ingresa un número chileno válido (ej: +56 9 1234 5678 o 912345678)",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    if (!formData.region) {
      toast({
        title: "Región requerida",
        description: "Por favor selecciona una región para el envío",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    try {
      // Simular procesamiento de pago (80% éxito, 20% error)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const exito = Math.random() > 0.2

      if (exito) {
        const itemsOrden: ItemOrden[] = items.map((item) => {
          const producto = productos.find((p) => p.id === item.productoId)
          return {
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio,
            nombreProducto: producto?.nombre || "Producto no disponible",
            imagenProducto: producto?.imagen || "/placeholder.svg",
            unidadProducto: producto?.unidad || "unidad",
          }
        })

        // Crear orden usando la API
        const ordenData = {
          usuarioId: usuario?.id || "invitado",
          items: itemsOrden,
          subtotal: total,
          envio: costoEnvio,
          total: total + costoEnvio,
          estado: "pendiente",
          metodoPago: formData.metodoPago,
          direccionEnvio: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            direccion: formData.direccion,
            ciudad: formData.ciudad,
            region: formData.region,
            codigoPostal: formData.codigoPostal,
            telefono: formatearTelefonoChileno(formData.telefono),
          },
          notas: "",
        }

        const orden = await crearOrdenAPI(ordenData)

        // Descontar stock usando la API (puede fallar si no hay permisos de admin)
        try {
          for (const item of items) {
            const producto = productos.find((p) => p.id === item.productoId)
            if (producto) {
              await actualizarProducto(producto.id, {
                stock: producto.stock - item.cantidad,
              })
            }
          }
        } catch (error) {
          console.error("No se pudo actualizar el stock (probablemente falta de permisos en PocketBase):", error)
          // No bloqueamos el flujo si falla el stock
        }

        toast({
          title: "¡Compra Exitosa!",
          description: `Tu pedido #${orden.id.slice(0, 8)} ha sido procesado correctamente.`,
          duration: 5000,
        })

        limpiarCarrito()
        setTimeout(() => {
          router.push("/mi-cuenta/pedidos")
        }, 1500)
      } else {
        toast({
          title: "Error en el Pago",
          description: "No se pudo procesar tu compra. Por favor, intenta nuevamente.",
          variant: "destructive",
          duration: 5000,
        })
        setTimeout(() => {
          router.push("/pago-error")
        }, 1500)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu orden",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/carrito">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver al Carrito
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Contacto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                          id="nombre"
                          value={formData.nombre}
                          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input
                          id="apellido"
                          value={formData.apellido}
                          onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        placeholder="+56 9 1234 5678"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Formato: +56 9 1234 5678 o 912345678</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dirección de Envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        value={formData.direccion}
                        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                        placeholder="Calle, número, depto"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ciudad">Ciudad</Label>
                        <Input
                          id="ciudad"
                          value={formData.ciudad}
                          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="region">
                          Región <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={formData.region}
                          onValueChange={(value) => setFormData({ ...formData, region: value })}
                        >
                          <SelectTrigger id="region">
                            <SelectValue placeholder="Selecciona una región" />
                          </SelectTrigger>
                          <SelectContent>
                            {regionesChile.map((region) => (
                              <SelectItem key={region} value={region}>
                                {region}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">Campo obligatorio</p>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="codigoPostal">Código Postal</Label>
                      <Input
                        id="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Método de Pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={formData.metodoPago}
                      onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                        <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                        <SelectItem value="efectivo">Efectivo contra entrega</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground mt-3">
                      Simulación de pago - No se procesarán pagos reales
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Resumen del Pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {items.map((item) => {
                        const producto = productos.find((p) => p.id === item.productoId)
                        if (!producto) return null
                        return (
                          <div key={item.productoId} className="flex gap-3">
                            <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                              <Image
                                src={producto.imagen || "/placeholder.svg"}
                                alt={producto.nombre}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold line-clamp-1">{producto.nombre}</h4>
                              <p className="text-xs text-muted-foreground">
                                {item.cantidad} x {formatearPrecio(item.precio)}
                              </p>
                              <p className="text-sm font-semibold">{formatearPrecio(item.precio * item.cantidad)}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="space-y-2 mb-6 border-t border-border pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">{formatearPrecio(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Envío</span>
                        <span className="font-semibold">{formatearPrecio(costoEnvio)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">{formatearPrecio(total + costoEnvio)}</span>
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="w-full gap-2" disabled={cargando}>
                      <CreditCard className="h-5 w-5" />
                      {cargando ? "Procesando..." : "Finalizar Compra"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
      <PiePagina />
    </>
  )
}
