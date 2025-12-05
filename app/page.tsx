"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Leaf, Truck, Shield, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Producto, Categoria } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"

export default function PaginaInicio() {
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([])
  const [productosOferta, setProductosOferta] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resProductos, resCategorias] = await Promise.all([fetch("/api/productos"), fetch("/api/categorias")])

        if (resProductos.ok && resCategorias.ok) {
          const productos: Producto[] = await resProductos.json()
          const cats: Categoria[] = await resCategorias.json()

          // Tomar los primeros 6 productos como "destacados"
          setProductosDestacados(productos.slice(0, 6))

          // Los productos con precioOferta se consideran en oferta
          setProductosOferta(productos.filter((p) => p.enOferta).slice(0, 3))

          // Mostrar primeras 4 categorías activas
          setCategorias(cats.filter((c) => c.activa).slice(0, 4))
        } else {
          console.error("[v0] Error cargando datos")
        }
      } catch (error) {
        console.error("[v0] Error en fetch de datos:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-balance mb-6 text-foreground">
                  Frutas y Verduras Frescas
                </h1>
                <p className="text-xl text-muted-foreground mb-8 text-pretty">
                  Directo del huerto a tu hogar. Calidad, frescura y sabor en cada producto que ofrecemos.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/productos">
                    <Button size="lg" className="gap-2">
                      Ver Productos <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/ofertas">
                    <Button size="lg" variant="outline">
                      Ver Ofertas
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/frutas-frescas-naturales.jpg"
                  alt="Frutas y verduras frescas"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">100% Natural</h3>
                <p className="text-sm text-muted-foreground">Productos frescos y naturales sin químicos</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">Entrega el mismo día en tu zona</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Garantía de Calidad</h3>
                <p className="text-sm text-muted-foreground">100% garantizado o te devolvemos tu dinero</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Con Amor</h3>
                <p className="text-sm text-muted-foreground">Seleccionados con cuidado para ti</p>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Destacados */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Productos Destacados</h2>
                <p className="text-muted-foreground">
                  {cargando ? "Cargando productos..." : "Los favoritos de nuestros clientes"}
                </p>
              </div>
              <Link href="/productos">
                <Button variant="outline" className="gap-2 bg-transparent">
                  Ver Todos <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            {cargando ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando productos desde PocketBase...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosDestacados.map((producto) => (
                  <Link key={producto.id} href={`/productos/${producto.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                        {producto.enOferta && producto.precioOferta && (
                          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                            {calcularDescuento(producto.precio, producto.precioOferta)}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{producto.descripcion}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {producto.enOferta && producto.precioOferta ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">
                                  {formatearPrecio(producto.precioOferta)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatearPrecio(producto.precio)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                            )}
                            <span className="text-xs text-muted-foreground"> / {producto.unidad}</span>
                          </div>
                          <Button size="sm">Ver Detalle</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Categorías */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">Categorías</h2>
              <p className="text-muted-foreground">Explora nuestras categorías de productos frescos</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categorias.map((categoria) => (
                <Link key={categoria.id} href={`/categorias/${categoria.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-40">
                      <Image
                        src={categoria.imagen || "/placeholder.svg"}
                        alt={categoria.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-lg">{categoria.nombre}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ofertas */}
        {productosOferta.length > 0 && (
          <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Ofertas Especiales</h2>
                  <p className="text-muted-foreground">Aprovecha nuestras ofertas por tiempo limitado</p>
                </div>
                <Link href="/ofertas">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Ver Todas <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productosOferta.map((producto) => (
                  <Link key={producto.id} href={`/productos/${producto.id}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                        {producto.precioOferta && (
                          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded text-sm font-semibold">
                            {calcularDescuento(producto.precio, producto.precioOferta)}% OFF
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl font-bold text-primary">
                            {formatearPrecio(producto.precioOferta!)}
                          </span>
                          <span className="text-lg text-muted-foreground line-through">
                            {formatearPrecio(producto.precio)}
                          </span>
                        </div>
                        <Button className="w-full">Agregar al Carrito</Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">¿Listo para empezar a comprar?</h2>
            <p className="text-xl mb-8 opacity-90">Recibe productos frescos y naturales directo en tu puerta</p>
            <Link href="/productos">
              <Button size="lg" variant="secondary" className="gap-2">
                Explorar Productos <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  )
}
