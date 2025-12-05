"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"
import type { Categoria } from "@/lib/tipos"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"

export default function PaginaEditarCategoria() {
  const router = useRouter()
  const params = useParams()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [cargando, setCargando] = useState(false)
  const [categoriaExistente, setCategoriaExistente] = useState<Categoria | null>(null)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
    activa: true,
  })

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      router.push("/login")
      return
    }

    cargarCategoria()
  }, [usuario, params.id, router])

  const cargarCategoria = async () => {
    try {
      const response = await fetch(`/api/categorias/${params.id}`)

      if (response.ok) {
        const categoria: Categoria = await response.json()
        setCategoriaExistente(categoria)
        setFormData({
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
          imagen: categoria.imagen,
          activa: categoria.activa,
        })
      } else {
        toast({
          title: "Error",
          description: "Categoría no encontrada",
          variant: "destructive",
        })
        router.push("/admin/categorias")
      }
    } catch (error) {
      console.error("[v0] Error cargando categoría:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
      router.push("/admin/categorias")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    if (!formData.nombre || !formData.descripcion) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    try {
      const response = await fetch(`/api/categorias/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          imagen: formData.imagen,
          activa: formData.activa,
        }),
      })

      if (response.ok) {
        toast({
          title: "Categoría actualizada",
          description: "La categoría ha sido actualizada exitosamente",
        })
        router.push("/admin/categorias")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "No se pudo actualizar la categoría",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error actualizando categoría:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  if (!usuario || usuario.rol !== "admin" || !categoriaExistente) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionAdmin />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Editar Categoría</h1>
          <p className="text-muted-foreground mt-1">Modifica la información de la categoría</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre de la Categoría *</label>
                <Input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Frutas Frescas"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Descripción *</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe la categoría..."
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL de Imagen</label>
                <Input
                  type="text"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="/categoria.jpg"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="activa"
                  checked={formData.activa}
                  onCheckedChange={(checked) => setFormData({ ...formData, activa: checked as boolean })}
                />
                <label htmlFor="activa" className="text-sm font-medium">
                  Categoría Activa
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={cargando} className="flex-1">
                  {cargando ? "Actualizando..." : "Actualizar Categoría"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/categorias")}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
