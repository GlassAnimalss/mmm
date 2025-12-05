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
import type { Categoria } from "@/lib/tipos"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"

export default function PaginaNuevoProducto() {
  const router = useRouter()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precioOferta: "",
    stock: "",
    categoria: "",
    imagen: "",
    unidad: "kg",
    destacado: false,
    enOferta: false,
    activo: true,
  })

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      router.push("/login")
      return
    }
    cargarCategorias()
  }, [usuario])

  const cargarCategorias = async () => {
    try {
      const response = await fetch("/api/categorias")
      if (response.ok) {
        const cats: Categoria[] = await response.json()
        setCategorias(cats.filter((c) => c.activa))
      }
    } catch (error) {
      console.error("[v0] Error cargando categorías:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)

    if (!formData.nombre || !formData.descripcion || !formData.precio || !formData.stock || !formData.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    const precioNumero = Number.parseInt(formData.precio)
    if (precioNumero <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    if (formData.precioOferta) {
      const precioOfertaNumero = Number.parseInt(formData.precioOferta)
      if (precioOfertaNumero <= 0) {
        toast({
          title: "Error",
          description: "El precio de oferta debe ser mayor a 0",
          variant: "destructive",
        })
        setCargando(false)
        return
      }
    }

    const stockNumero = Number.parseInt(formData.stock)
    if (stockNumero > 10000) {
      toast({
        title: "Error",
        description: "El stock no puede superar las 10,000 unidades",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    if (stockNumero < 0) {
      toast({
        title: "Error",
        description: "El stock no puede ser negativo",
        variant: "destructive",
      })
      setCargando(false)
      return
    }

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio: precioNumero,
          stock: stockNumero,
          categoria: formData.categoria,
          imagen: formData.imagen || "/generic-product-display.png",
          unidad: formData.unidad,
          activo: formData.activo,
        }),
      })

      if (response.ok) {
        toast({
          title: "Producto creado",
          description: "El producto ha sido creado exitosamente",
        })
        router.push("/admin/productos")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "No se pudo crear el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error creando producto:", error)
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Nuevo Producto</h1>
          <p className="text-muted-foreground mt-1">Agrega un nuevo producto al inventario</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre del Producto *</label>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Manzanas Rojas"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría *</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Descripción *</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el producto..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Precio *</label>
                  <Input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="1990"
                    min="1"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Debe ser mayor a 0</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Precio Oferta</label>
                  <Input
                    type="number"
                    value={formData.precioOferta}
                    onChange={(e) => setFormData({ ...formData, precioOferta: e.target.value })}
                    placeholder="1490"
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Debe ser mayor a 0</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Stock *</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    min="0"
                    max="10000"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Máximo 10,000 unidades</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Unidad</label>
                  <select
                    className="w-full px-3 py-2 border rounded-md"
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  >
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="unidad">Unidad</option>
                    <option value="manojo">Manojo</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">URL de Imagen</label>
                  <Input
                    type="text"
                    value={formData.imagen}
                    onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                    placeholder="/producto.jpg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="destacado"
                    checked={formData.destacado}
                    onCheckedChange={(checked) => setFormData({ ...formData, destacado: checked as boolean })}
                  />
                  <label htmlFor="destacado" className="text-sm font-medium">
                    Producto Destacado
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="enOferta"
                    checked={formData.enOferta}
                    onCheckedChange={(checked) => setFormData({ ...formData, enOferta: checked as boolean })}
                  />
                  <label htmlFor="enOferta" className="text-sm font-medium">
                    En Oferta
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="activo"
                    checked={formData.activo}
                    onCheckedChange={(checked) => setFormData({ ...formData, activo: checked as boolean })}
                  />
                  <label htmlFor="activo" className="text-sm font-medium">
                    Producto Activo
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={cargando} className="flex-1">
                  {cargando ? "Creando..." : "Crear Producto"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")}>
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
