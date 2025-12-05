"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import { obtenerOrdenesAPI } from "@/lib/api/ordenes"
import type { Orden } from "@/lib/tipos"
import { formatearPrecio } from "@/lib/utilidades"
import { useToast } from "@/hooks/use-toast"

export default function PaginaAdminOrdenes() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const { toast } = useToast()
  const [ordenes, setOrdenes] = useState<Orden[]>([])
  const [ordenesFiltradas, setOrdenesFiltradas] = useState<Orden[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }

    cargarOrdenes()
  }, [autenticado, usuario, router])

  const cargarOrdenes = async () => {
    try {
      setCargando(true)
      const data = await obtenerOrdenesAPI()
      const ordenadas = data.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
      setOrdenes(ordenadas)
      setOrdenesFiltradas(ordenadas)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las órdenes",
        variant: "destructive",
      })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    let resultado = [...ordenes]

    if (busqueda) {
      resultado = resultado.filter((o) => o.id.toLowerCase().includes(busqueda.toLowerCase()))
    }

    if (filtroEstado !== "todos") {
      resultado = resultado.filter((o) => o.estado === filtroEstado)
    }

    setOrdenesFiltradas(resultado)
  }, [busqueda, filtroEstado, ordenes])

  if (!autenticado || usuario?.rol !== "admin") {
    return null
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-secondary text-secondary-foreground"
      case "procesando":
        return "bg-primary text-primary-foreground"
      case "enviado":
        return "bg-primary text-primary-foreground"
      case "entregado":
        return "bg-primary text-primary-foreground"
      case "cancelado":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Gestión de Órdenes</h1>
            <p className="text-muted-foreground">Administra y revisa todas las órdenes</p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por ID de orden..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                    <SelectItem value="enviado">Enviado</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {cargando ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Cargando órdenes...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ordenesFiltradas.map((orden) => (
                <Card key={orden.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">Orden #{orden.id}</h3>
                          <Badge className={obtenerColorEstado(orden.estado)}>
                            {orden.estado.charAt(0).toUpperCase() + orden.estado.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(orden.fechaCreacion).toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatearPrecio(orden.total)}</p>
                        <p className="text-sm text-muted-foreground">{orden.items.length} producto(s)</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                        <p className="font-semibold">
                          {orden.direccionEnvio.nombre} {orden.direccionEnvio.apellido}
                        </p>
                      </div>
                      <Link href={`/admin/ordenes/${orden.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Eye className="h-4 w-4" /> Ver Detalle
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!cargando && ordenesFiltradas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron órdenes</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
