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

export default function PaginaNuevoArticulo() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [guardando, setGuardando] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    extracto: "",
    imagen: "",
    autor: "Equipo Huerto Hogar",
    contenido: "",
    activo: true,
  })

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
    }
  }, [autenticado, usuario, router])

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
    const nuevoArticulo: Articulo = {
      id: Date.now().toString(),
      titulo: formData.titulo.trim(),
      extracto: formData.extracto.trim(),
      imagen: formData.imagen.trim() || "/blog-article.jpg",
      fecha: new Date().toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      autor: formData.autor.trim() || "Equipo Huerto Hogar",
      contenido: formData.contenido.split("\n\n").filter((p) => p.trim()),
      activo: formData.activo,
    }

    articulos.push(nuevoArticulo)
    guardarArticulos(articulos)
    toast.success("Artículo creado correctamente")
    router.push("/admin/blog")
  }

  if (!autenticado || usuario?.rol !== "admin") {
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
              <CardTitle>Nuevo Artículo</CardTitle>
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
                    placeholder="Breve descripción del artículo (se muestra en la lista)"
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
                  <p className="text-xs text-muted-foreground">Deja vacío para usar imagen por defecto</p>
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
                    placeholder="Escribe el contenido del artículo. Separa los párrafos con líneas en blanco."
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
                  <Label htmlFor="activo">Artículo activo (visible en el blog)</Label>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={guardando} className="gap-2">
                    <Save className="h-4 w-4" />
                    {guardando ? "Guardando..." : "Crear Artículo"}
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
