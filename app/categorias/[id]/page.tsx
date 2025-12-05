"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Producto, Categoria } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"

export default function PaginaCategoria() {
  const params = useParams()
  const [categoria, setCategoria] = useState<Categoria | null>(null)
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarCategoria() {
      try {
        const resCategoria = await fetch(`/api/categorias/${params.id}`)

        if (resCategoria.ok) {
          const cat: Categoria = await resCategoria.json()
          setCategoria(cat)

          // Cargar productos de la categoría
          const resProductos = await fetch("/api/productos")
          if (resProductos.ok) {
            const todos: Producto[] = await resProductos.json()
            const prods = todos.filter((p) => p.categoria === cat.id && p.activo)
            setProductos(prods)
          }
        }
      } catch (error) {
        console.error("[v0] Error cargando categoría:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarCategoria()
  }, [params.id])

  if (cargando) {
    return (
      <>
        <NavegacionPublica />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
        <PiePagina />
      </>
    )
  }

  if (!categoria) {
    return (
      <>
        <NavegacionPublica />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Categoría no encontrada</h2>
            <Link href="/categorias">
              <Button>Volver a Categorías</Button>
            </Link>
          </div>
        </div>
        <PiePagina />
      </>
    )
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/categorias">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Categorías
            </Button>
          </Link>

          {/* Hero de Categoría */}
          <div className="mb-12">
            <div className="relative h-64 rounded-lg overflow-hidden mb-6">
              <Image
                src={categoria.imagen || "/placeholder.svg"}
                alt={categoria.nombre}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-5xl font-bold mb-2">{categoria.nombre}</h1>
                  <p className="text-xl">{categoria.descripcion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground mb-2">Productos en {categoria.nombre}</h2>
            <p className="text-muted-foreground">{productos.length} productos disponibles</p>
          </div>

          {productos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <Link key={producto.id} href={`/productos/${producto.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No hay productos disponibles en esta categoría</p>
              <Link href="/productos">
                <Button>Ver Todos los Productos</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
