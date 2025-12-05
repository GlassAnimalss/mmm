"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"
import { obtenerCategorias } from "@/lib/datos-locales"
import type { Producto, Categoria } from "@/lib/tipos"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { AlertTriangle, X } from "lucide-react"

export default function PaginaAdminProductos() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroBajoStock, setFiltroBajoStock] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      router.push("/login")
      return
    }
  }, [usuario, router])

  useEffect(() => {
    cargarProductos()
    setCategorias(obtenerCategorias())
  }, [])

  useEffect(() => {
    const filtroParam = searchParams.get("filtro")
    const categoriaParam = searchParams.get("categoria")

    if (filtroParam === "bajo-stock") {
      setFiltroBajoStock(true)
    }

    if (categoriaParam) {
      setFiltroCategoria(categoriaParam)
    }
  }, [searchParams])

  const cargarProductos = async () => {
    try {
      setCargando(true)
      const response = await fetch("/api/productos")
      if (response.ok) {
        const datos = await response.json()
        setProductos(datos)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error cargando productos:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  const eliminarProducto = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProductos(productos.filter((p) => p.id !== id))
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error eliminando producto:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    }
  }

  const toggleActivo = async (id: string) => {
    const producto = productos.find((p) => p.id === id)
    if (!producto) return

    try {
      const response = await fetch(`/api/productos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activo: !producto.activo,
        }),
      })

      if (response.ok) {
        const productoActualizado = await response.json()
        setProductos(productos.map((p) => (p.id === id ? productoActualizado : p)))
        toast({
          title: "Estado actualizado",
          description: "El estado del producto ha sido actualizado",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error actualizando estado:", error)
      toast({
        title: "Error",
        description: "Error de conexión con el servidor",
        variant: "destructive",
      })
    }
  }

  const productosFiltrados = productos.filter((producto) => {
    const cumpleBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    const cumpleCategoria = !filtroCategoria || producto.categoria === filtroCategoria
    const cumpleEstado =
      !filtroEstado ||
      (filtroEstado === "activo" && producto.activo) ||
      (filtroEstado === "inactivo" && !producto.activo)

    const cumpleBajoStock = !filtroBajoStock || producto.stock < 10

    return cumpleBusqueda && cumpleCategoria && cumpleEstado && cumpleBajoStock
  })

  const obtenerNombreCategoria = (categoriaId: string) => {
    const categoria = categorias.find((c) => c.id === categoriaId)
    return categoria?.nombre || "Sin categoría"
  }

  if (!usuario || usuario.rol !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionAdmin />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Productos</h1>
            <p className="text-muted-foreground mt-1">Administra el inventario de productos</p>
          </div>
          <Link href="/admin/productos/nuevo">
            <Button>Agregar Producto</Button>
          </Link>
        </div>

        {filtroBajoStock && (
          <Card className="mb-4 border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <div>
                    <p className="font-semibold text-foreground">Mostrando productos con stock bajo</p>
                    <p className="text-sm text-muted-foreground">Productos con menos de 10 unidades en stock</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFiltroBajoStock(false)
                    router.push("/admin/productos")
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Quitar filtro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 border rounded-md"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 border rounded-md"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {cargando ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Cargando productos...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {productosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {filtroBajoStock ? "No hay productos con stock bajo" : "No se encontraron productos"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              productosFiltrados.map((producto) => (
                <Card key={producto.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">{producto.nombre}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{producto.descripcion}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline">{obtenerNombreCategoria(producto.categoria)}</Badge>
                              {producto.enOferta && <Badge className="bg-red-500">Oferta</Badge>}
                              {producto.destacado && <Badge className="bg-yellow-500">Destacado</Badge>}
                              <Badge variant={producto.activo ? "default" : "secondary"}>
                                {producto.activo ? "Activo" : "Inactivo"}
                              </Badge>
                              {producto.stock < 10 && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Stock Bajo
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div
                            className={`text-sm mt-1 ${producto.stock < 10 ? "text-destructive font-semibold" : "text-muted-foreground"}`}
                          >
                            Stock: {producto.stock} {producto.unidad}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Link href={`/admin/productos/${producto.id}`}>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm" onClick={() => toggleActivo(producto.id)}>
                            {producto.activo ? "Desactivar" : "Activar"}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => eliminarProducto(producto.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
