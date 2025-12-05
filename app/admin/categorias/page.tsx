"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"
import { obtenerCategoriasAPI, eliminarCategoriaAPI, actualizarCategoriaAPI } from "@/lib/api/categorias"
import { obtenerProductos } from "@/lib/api/productos"
import type { Categoria } from "@/lib/tipos"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"

export default function PaginaAdminCategorias() {
  const router = useRouter()
  const { usuario } = useAuth()
  const { toast } = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [cargando, setCargando] = useState(true)

  const [conteoProductos, setConteoProductos] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!usuario || usuario.rol !== "admin") {
      router.push("/login")
      return
    }
    cargarDatos()
  }, [usuario, router])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [categoriasData, productosData] = await Promise.all([
        obtenerCategoriasAPI(),
        obtenerProductos()
      ])

      setCategorias(categoriasData)

      // Calcular conteo de productos por categoría
      const conteo: Record<string, number> = {}
      productosData.forEach(producto => {
        if (producto.categoria) {
          conteo[producto.categoria] = (conteo[producto.categoria] || 0) + 1
        }
      })
      setConteoProductos(conteo)

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  const eliminarCategoriaHandler = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta categoría?")) return

    try {
      await eliminarCategoriaAPI(id)
      setCategorias(categorias.filter((c) => c.id !== id))

      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      })
    }
  }

  const toggleActiva = async (id: string) => {
    try {
      const categoria = categorias.find((c) => c.id === id)
      if (!categoria) return

      await actualizarCategoriaAPI(id, { activa: !categoria.activa })

      const categoriasActualizadas = categorias.map((c) => (c.id === id ? { ...c, activa: !c.activa } : c))
      setCategorias(categoriasActualizadas)

      toast({
        title: "Estado actualizado",
        description: "El estado de la categoría ha sido actualizado",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      })
    }
  }

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

  if (!usuario || usuario.rol !== "admin") {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionAdmin />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestión de Categorías</h1>
            <p className="text-muted-foreground mt-1">Administra las categorías de productos</p>
          </div>
          <Link href="/admin/categorias/nueva">
            <Button>Agregar Categoría</Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <Input
              type="text"
              placeholder="Buscar categorías..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </CardContent>
        </Card>

        {cargando ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Cargando categorías...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriasFiltradas.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No se encontraron categorías</p>
                </CardContent>
              </Card>
            ) : (
              categoriasFiltradas.map((categoria) => (
                <Card key={categoria.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                      <img
                        src={categoria.imagen || "/placeholder.svg"}
                        alt={categoria.nombre}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={categoria.activa ? "default" : "secondary"}>
                          {categoria.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{categoria.nombre}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{categoria.descripcion}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 mb-6">
                        <div className="text-sm font-medium">
                          {conteoProductos[categoria.id] || 0} productos
                        </div>
                        <Link href={`/admin/productos?categoria=${categoria.id}`}>
                          <Button variant="link" size="sm" className="h-auto p-0 text-primary">
                            Ver productos &rarr;
                          </Button>
                        </Link>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/admin/categorias/${categoria.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            Editar
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => toggleActiva(categoria.id)}>
                          {categoria.activa ? "Desactivar" : "Activar"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => eliminarCategoriaHandler(categoria.id)}>
                          Eliminar
                        </Button>
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
