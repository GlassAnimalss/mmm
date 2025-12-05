"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"

export default function PaginaNuevaCategoria() {
  const router = useRouter()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [cargando, setCargando] = useState(false)

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
  }, [usuario])

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
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          imagen: formData.imagen || "/categoria.png",
          activa: formData.activa,
        }),
      })

      if (response.ok) {
        toast({
          title: "Categoría creada",
          description: "La categoría ha sido creada exitosamente",
        })
        router.push("/admin/categorias")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "No se pudo crear la categoría",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creando categoría:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  if (!usuario || usuario.rol !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionAdmin />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Nueva Categoría</h1>
          <p className="text-muted-foreground mt-1">Agrega una nueva categoría de productos</p>
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
                  {cargando ? "Creando..." : "Crear Categoría"}
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
