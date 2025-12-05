"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { obtenerArticulos, inicializarDatos } from "@/lib/datos-locales"
import type { Articulo } from "@/lib/tipos"

export default function PaginaBlog() {
  const [articulos, setArticulos] = useState<Articulo[]>([])

  useEffect(() => {
    inicializarDatos()
    // Solo mostrar artículos activos
    const articulosActivos = obtenerArticulos().filter((a) => a.activo)
    setArticulos(articulosActivos)
  }, [])

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Blog</h1>
            <p className="text-muted-foreground">Consejos, recetas y novedades sobre alimentación saludable</p>
          </div>

          {articulos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay artículos publicados aún.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {articulos.map((articulo) => (
                <Card key={articulo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64">
                    <Image
                      src={articulo.imagen || "/placeholder.svg"}
                      alt={articulo.titulo}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{articulo.fecha}</span>
                      <span>•</span>
                      <span>{articulo.autor}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">{articulo.titulo}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{articulo.extracto}</p>
                    <Link href={`/blog/${articulo.id}`}>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        Leer más <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
