"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Categoria } from "@/lib/tipos"

export default function PaginaCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [conteoProductos, setConteoProductos] = useState<Record<string, number>>({})
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarCategorias() {
      try {
        const [resCategorias, resProductos] = await Promise.all([fetch("/api/categorias"), fetch("/api/productos")])

        if (resCategorias.ok && resProductos.ok) {
          const cats: Categoria[] = await resCategorias.json()
          const productos = await resProductos.json()

          const categoriasActivas = cats.filter((c) => c.activa)
          setCategorias(categoriasActivas)

          // Contar productos por categoría
          const conteo: Record<string, number> = {}
          categoriasActivas.forEach((cat) => {
            conteo[cat.id] = productos.filter((p: any) => p.categoria === cat.id && p.activo).length
          })
          setConteoProductos(conteo)
        }
      } catch (error) {
        console.error("[v0] Error cargando categorías:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarCategorias()
  }, [])

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Categorías</h1>
            <p className="text-muted-foreground">Explora nuestras categorías de productos frescos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cargando ? (
              <p className="col-span-full text-center text-muted-foreground">Cargando categorías...</p>
            ) : (
              categorias.map((categoria) => (
                <Link key={categoria.id} href={`/categorias/${categoria.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <div className="relative h-64">
                      <Image
                        src={categoria.imagen || "/placeholder.svg"}
                        alt={categoria.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-foreground mb-2">{categoria.nombre}</h2>
                      <p className="text-muted-foreground mb-3">{categoria.descripcion}</p>
                      <p className="text-sm text-primary font-semibold">
                        {conteoProductos[categoria.id] || 0} productos disponibles
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  )
}
