"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import { obtenerArticulos, guardarArticulos } from "@/lib/datos-locales"
import type { Articulo } from "@/lib/tipos"
import { toast } from "sonner"

export default function PaginaEditarArticulo({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [guardando, setGuardando] = useState(false)
  const [articulo, setArticulo] = useState<Articulo | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    extracto: "",
    imagen: "",
    autor: "",
    contenido: "",
    activo: true,
  })

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }

    const articulos = obtenerArticulos()
    const articuloEncontrado = articulos.find((a) => a.id === params.id)

    if (!articuloEncontrado) {
      toast.error("Artículo no encontrado")
      router.push("/admin/blog")
      return
    }

    setArticulo(articuloEncontrado)
    setFormData({
      titulo: articuloEncontrado.titulo,
      extracto: articuloEncontrado.extracto,
      imagen: articuloEncontrado.imagen,
      autor: articuloEncontrado.autor,
      contenido: articuloEncontrado.contenido.join("\n\n"),
      activo: articuloEncontrado.activo,
    })
  }, [autenticado, usuario, router, params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo.trim()) {
      toast.error("El título es obligatorio")
      return
    }

    if (!formData.extracto.trim()) {
      toast.error("El extracto es obligatorio")
      return
    }

    if (!formData.contenido.trim()) {
      toast.error("El contenido es obligatorio")
      return
    }

    setGuardando(true)

    const articulos = obtenerArticulos()
    const index = articulos.findIndex((a) => a.id === params.id)

    if (index === -1) {
      toast.error("Artículo no encontrado")
      return
    }

    articulos[index] = {
      ...articulos[index],
      titulo: formData.titulo.trim(),
      extracto: formData.extracto.trim(),
      imagen: formData.imagen.trim() || "/blog-article.jpg",
      autor: formData.autor.trim() || "Equipo Huerto Hogar",
      contenido: formData.contenido.split("\n\n").filter((p) => p.trim()),
      activo: formData.activo,
    }

    guardarArticulos(articulos)
    toast.success("Artículo actualizado correctamente")
    router.push("/admin/blog")
  }

  if (!autenticado || usuario?.rol !== "admin" || !articulo) {
    return null
  }

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin/blog">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Blog
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Editar Artículo</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Título del artículo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="extracto">
                    Extracto <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="extracto"
                    value={formData.extracto}
                    onChange={(e) => setFormData({ ...formData, extracto: e.target.value })}
                    placeholder="Breve descripción del artículo"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imagen">URL de Imagen</Label>
                  <Input
                    id="imagen"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    placeholder="/mi-imagen.jpg o URL externa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    value={formData.autor}
                    onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                    placeholder="Nombre del autor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contenido">
                    Contenido <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="contenido"
                    value={formData.contenido}
                    onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                    placeholder="Contenido del artículo"
                    rows={12}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separa los párrafos con líneas en blanco (doble enter)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                  />
                  <Label htmlFor="activo">Artículo activo</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={guardando} className="gap-2">
                    <Save className="h-4 w-4" />
                    {guardando ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                  <Link href="/admin/blog">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
