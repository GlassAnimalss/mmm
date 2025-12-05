"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowLeft, User, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import {
  obtenerArticulos,
  obtenerComentariosPorArticulo,
  agregarComentario,
  inicializarDatos,
} from "@/lib/datos-locales"
import type { Articulo, Comentario } from "@/lib/tipos"
import { toast } from "sonner"

export default function PaginaArticuloBlog({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [articulo, setArticulo] = useState<Articulo | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState({
    nombre: "",
    comentario: "",
  })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    inicializarDatos()
    const articulos = obtenerArticulos()
    const articuloEncontrado = articulos.find((a) => a.id === params.id && a.activo)

    if (!articuloEncontrado) {
      router.push("/blog")
      return
    }

    setArticulo(articuloEncontrado)
    setComentarios(obtenerComentariosPorArticulo(params.id))
  }, [params.id, router])

  const handleSubmitComentario = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevoComentario.nombre.trim()) {
      toast.error("Por favor ingresa tu nombre")
      return
    }

    if (!nuevoComentario.comentario.trim()) {
      toast.error("Por favor escribe un comentario")
      return
    }

    setEnviando(true)

    agregarComentario(params.id, nuevoComentario.nombre.trim(), nuevoComentario.comentario.trim())

    setComentarios(obtenerComentariosPorArticulo(params.id))
    setNuevoComentario({ nombre: "", comentario: "" })
    setEnviando(false)
    toast.success("Comentario publicado correctamente")
  }

  const formatearFechaComentario = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!articulo) {
    return null
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver al Blog
            </Button>
          </Link>

          <article>
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
              <Image src={articulo.imagen || "/placeholder.svg"} alt={articulo.titulo} fill className="object-cover" />
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{articulo.fecha}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{articulo.autor}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-8">{articulo.titulo}</h1>

            <div className="prose prose-lg max-w-none mb-12">
              {articulo.contenido.map((parrafo, index) => (
                <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                  {parrafo}
                </p>
              ))}
            </div>
          </article>

          {/* Sección de Comentarios */}
          <div className="border-t pt-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Comentarios ({comentarios.length})</h2>
            </div>

            {/* Formulario para nuevo comentario */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Deja tu comentario</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComentario} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">
                      Nombre <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombre"
                      value={nuevoComentario.nombre}
                      onChange={(e) =>
                        setNuevoComentario({
                          ...nuevoComentario,
                          nombre: e.target.value,
                        })
                      }
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comentario">
                      Comentario <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="comentario"
                      value={nuevoComentario.comentario}
                      onChange={(e) =>
                        setNuevoComentario({
                          ...nuevoComentario,
                          comentario: e.target.value,
                        })
                      }
                      placeholder="Escribe tu comentario..."
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={enviando} className="gap-2">
                    <Send className="h-4 w-4" />
                    {enviando ? "Publicando..." : "Publicar Comentario"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de comentarios */}
            {comentarios.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aún no hay comentarios. ¡Sé el primero en comentar!
              </p>
            ) : (
              <div className="space-y-4">
                {comentarios.map((comentario) => (
                  <Card key={comentario.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">{comentario.nombre}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatearFechaComentario(comentario.fechaCreacion)}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{comentario.comentario}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  )
}
