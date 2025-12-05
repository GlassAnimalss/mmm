"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import type { Producto, Categoria } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"
import { useCarrito } from "@/contextos/ContextoCarrito"
import { useToast } from "@/hooks/use-toast"

function esActivo(valor: any): boolean {
  if (typeof valor === "boolean") return valor
  if (typeof valor === "string") return valor.toLowerCase() === "true"
  if (typeof valor === "number") return valor === 1
  return false
}

export default function PaginaProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
  const [ordenar, setOrdenar] = useState("destacados")
  const [cargando, setCargando] = useState(true)
  const { agregarItem } = useCarrito()
  const { toast } = useToast()

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [resProductos, resCategorias] = await Promise.all([fetch("/api/productos"), fetch("/api/categorias")])

        console.log("✅ Status productos:", resProductos.status)
        console.log("✅ Status categorias:", resCategorias.status)

        if (resProductos.ok && resCategorias.ok) {
          const prods: Producto[] = await resProductos.json()
          const cats: Categoria[] = await resCategorias.json()

          console.log("📦 Productos recibidos:", prods)
          console.log("🔍 Primer producto activo?:", prods[0]?.activo, "Tipo:", typeof prods[0]?.activo)
          console.log("📂 Categorías recibidas:", cats)

          const productosActivos = prods.filter((p) => esActivo(p.activo))
          console.log("✨ Productos activos:", productosActivos)

          setProductos(productosActivos)
          setProductosFiltrados(productosActivos)
          setCategorias(cats.filter((c) => esActivo(c.activa)))
        } else {
          // ...existing code...
          console.error("[v0] Error cargando datos")
        }
      } catch (error) {
        console.error("[v0] Error en fetch de datos:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  // ...rest of code...

  useEffect(() => {
    let resultado = [...productos]

    // Filtrar por búsqueda
    if (busqueda) {
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    }

    // Filtrar por categoría
    if (categoriaFiltro !== "todas") {
      resultado = resultado.filter((p) => p.categoria === categoriaFiltro)
    }

    // Ordenar
    switch (ordenar) {
      case "precio-asc":
        resultado.sort((a, b) => {
          const precioA = a.precioOferta || a.precio
          const precioB = b.precioOferta || b.precio
          return precioA - precioB
        })
        break
      case "precio-desc":
        resultado.sort((a, b) => {
          const precioA = a.precioOferta || a.precio
          const precioB = b.precioOferta || b.precio
          return precioB - precioA
        })
        break
      case "nombre":
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      default:
        resultado.sort((a, b) => {
          if (a.destacado && !b.destacado) return -1
          if (!a.destacado && b.destacado) return 1
          return 0
        })
    }

    setProductosFiltrados(resultado)
  }, [busqueda, categoriaFiltro, ordenar, productos])

  const handleAgregarCarrito = (e: React.MouseEvent, producto: Producto) => {
    e.preventDefault()
    if (producto.stock === 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no tiene stock disponible",
        variant: "destructive",
      })
      return
    }
    agregarItem(producto, 1)
    toast({
      title: "Producto agregado",
      description: `${producto.nombre} agregado al carrito`,
    })
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Productos</h1>
            <p className="text-muted-foreground">Explora nuestro catálogo completo de frutas y verduras frescas</p>
          </div>

          {/* Filtros */}
          <div className="bg-card border border-border rounded-lg p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las categorías</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.nombre}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ordenar} onValueChange={setOrdenar}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="destacados">Destacados</SelectItem>
                  <SelectItem value="nombre">Nombre</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Productos */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {cargando ? "Cargando..." : `Mostrando ${productosFiltrados.length} productos`}
            </p>
          </div>

          {cargando ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Cargando productos desde PocketBase...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="flex flex-col h-full">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <Link href={`/productos/${producto.id}`} className="flex-1">
                      <div className="relative h-48">
                        <Image
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                        {producto.enOferta && producto.precioOferta && (
                          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                            {calcularDescuento(producto.precio, producto.precioOferta)}% OFF
                          </div>
                        )}
                        {producto.stock < 10 && (
                          <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
                            ¡Últimas unidades!
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">
                          {producto.descripcion}
                        </p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            {producto.enOferta && producto.precioOferta ? (
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">
                                  {formatearPrecio(producto.precioOferta)}
                                </span>
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatearPrecio(producto.precio)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                            )}
                            <span className="text-xs text-muted-foreground"> / {producto.unidad}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                    <div className="px-4 pb-4">
                      <Button
                        onClick={(e) => handleAgregarCarrito(e, producto)}
                        disabled={producto.stock === 0}
                        variant={producto.stock === 0 ? "secondary" : "default"}
                        className="w-full gap-2"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {producto.stock === 0 ? "Sin Stock" : "Agregar"}
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}

          {productosFiltrados.length === 0 && !cargando && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No se encontraron productos con los filtros seleccionados</p>
              <Button
                onClick={() => {
                  setBusqueda("")
                  setCategoriaFiltro("todas")
                  setOrdenar("destacados")
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
