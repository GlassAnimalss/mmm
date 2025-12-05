"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Producto, Categoria } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"
import { useCarrito } from "@/contextos/ContextoCarrito"
import { useToast } from "@/hooks/use-toast"

export default function PaginaDetalleProducto() {
  const params = useParams()
  const router = useRouter()
  const { agregarItem } = useCarrito()
  const { toast } = useToast()
  const [producto, setProducto] = useState<Producto | null>(null)
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [productosRelacionados, setProductosRelacionados] = useState<Producto[]>([])
  const [cantidad, setCantidad] = useState(1)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarProducto() {
      try {
        const resProducto = await fetch(`/api/productos/${params.id}`)

        if (resProducto.ok) {
          const prod: Producto = await resProducto.json()
          setProducto(prod)

          // Cargar categoría
          const resCategoria = await fetch(`/api/categorias/${prod.categoria}`)
          if (resCategoria.ok) {
            const cat: Categoria = await resCategoria.json()
            setCategoria(cat)
          }

          // Cargar productos relacionados (misma categoría)
          const resRelacionados = await fetch("/api/productos")
          if (resRelacionados.ok) {
            const todos: Producto[] = await resRelacionados.json()
            const relacionados = todos
              .filter((p) => p.categoria === prod.categoria && p.id !== prod.id && p.activo)
              .slice(0, 4)
            setProductosRelacionados(relacionados)
          }
        }
      } catch (error) {
        console.error("[v0] Error cargando producto:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarProducto()
  }, [params.id])

  const handleAgregarCarrito = () => {
    if (producto) {
      if (cantidad > producto.stock) {
        toast({
          title: "Stock insuficiente",
          description: `Solo hay ${producto.stock} unidades disponibles`,
          variant: "destructive",
        })
        return
      }
      agregarItem(producto, cantidad)
      toast({
        title: "Producto agregado",
        description: `${cantidad} ${producto.unidad}(s) de ${producto.nombre} agregado(s) al carrito`,
      })
    }
  }

  if (cargando) {
    return (
      <>
        <NavegacionPublica />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Cargando producto...</p>
        </div>
        <PiePagina />
      </>
    )
  }

  if (!producto) {
    return (
      <>
        <NavegacionPublica />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
            <Link href="/productos">
              <Button>Volver a Productos</Button>
            </Link>
          </div>
        </div>
        <PiePagina />
      </>
    )
  }

  const precioFinal = producto.precioOferta || producto.precio

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/productos">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Productos
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Imagen */}
            <div className="relative h-[500px] rounded-lg overflow-hidden bg-muted">
              <Image src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} fill className="object-cover" />
              {producto.enOferta && producto.precioOferta && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-lg font-semibold">
                  {calcularDescuento(producto.precio, producto.precioOferta)}% OFF
                </div>
              )}
            </div>

            {/* Información */}
            <div>
              {categoria && (
                <Link href={`/categorias/${categoria.id}`}>
                  <span className="text-sm text-primary hover:underline">{categoria.nombre}</span>
                </Link>
              )}
              <h1 className="text-4xl font-bold text-foreground mt-2 mb-4">{producto.nombre}</h1>
              <p className="text-lg text-muted-foreground mb-6">{producto.descripcion}</p>

              <div className="mb-6">
                {producto.enOferta && producto.precioOferta ? (
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-primary">{formatearPrecio(producto.precioOferta)}</span>
                      <span className="text-2xl text-muted-foreground line-through">
                        {formatearPrecio(producto.precio)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ahorra {formatearPrecio(producto.precio - producto.precioOferta)}
                    </p>
                  </div>
                ) : (
                  <span className="text-4xl font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                )}
                <span className="text-lg text-muted-foreground ml-2">/ {producto.unidad}</span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">
                  Stock disponible:{" "}
                  <span className="font-semibold text-foreground">
                    {producto.stock} {producto.unidad}(s)
                  </span>
                </p>
                {producto.stock < 10 && (
                  <p className="text-sm text-destructive font-semibold">¡Últimas unidades disponibles!</p>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <Button variant="ghost" size="icon" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">{cantidad}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total:{" "}
                  <span className="font-bold text-foreground text-lg">{formatearPrecio(precioFinal * cantidad)}</span>
                </span>
              </div>

              <Button size="lg" className="w-full gap-2" onClick={handleAgregarCarrito} disabled={producto.stock === 0}>
                <ShoppingCart className="h-5 w-5" />
                {producto.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
              </Button>
            </div>
          </div>

          {/* Productos Relacionados */}
          {productosRelacionados.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-foreground mb-6">Productos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {productosRelacionados.map((prod) => (
                  <Link key={prod.id} href={`/productos/${prod.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <div className="relative h-48">
                        <Image
                          src={prod.imagen || "/placeholder.svg"}
                          alt={prod.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{prod.nombre}</h3>
                        <span className="text-lg font-bold text-primary">
                          {formatearPrecio(prod.precioOferta || prod.precio)}
                        </span>
                        <span className="text-xs text-muted-foreground"> / {prod.unidad}</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
