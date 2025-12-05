"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Producto } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"

export default function PaginaOfertas() {
  const [ofertas, setOfertas] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarOfertas() {
      try {
        const response = await fetch("/api/productos")
        if (response.ok) {
          const productos: Producto[] = await response.json()
          const productosOferta = productos.filter((p) => p.enOferta && p.precioOferta && p.activo)
          setOfertas(productosOferta)
        }
      } catch (error) {
        console.error("[v0] Error cargando ofertas:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarOfertas()
  }, [])

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Ofertas Especiales</h1>
            <p className="text-muted-foreground">Aprovecha nuestras mejores ofertas por tiempo limitado</p>
          </div>

          {cargando ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Cargando ofertas...</p>
            </div>
          ) : ofertas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ofertas.map((producto) => (
                <Link key={producto.id} href={`/productos/${producto.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-56">
                      <Image
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                        {calcularDescuento(producto.precio, producto.precioOferta!)}% OFF
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-xl mb-2">{producto.nombre}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{producto.descripcion}</p>
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl font-bold text-primary">
                          {formatearPrecio(producto.precioOferta!)}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                          {formatearPrecio(producto.precio)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Ahorras:{" "}
                          <span className="font-semibold text-foreground">
                            {formatearPrecio(producto.precio - producto.precioOferta!)}
                          </span>
                        </span>
                        <Button size="sm">Ver Detalle</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No hay ofertas disponibles en este momento</p>
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
