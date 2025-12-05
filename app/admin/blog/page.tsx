"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import NavegacionAdmin from "@/componentes/NavegacionAdmin"
import { useAuth } from "@/contextos/ContextoAuth"
import { obtenerArticulos, guardarArticulos } from "@/lib/datos-locales"
import type { Articulo } from "@/lib/tipos"
import { toast } from "sonner"

export default function PaginaAdminBlog() {
  const router = useRouter()
  const { usuario, autenticado } = useAuth()
  const [articulos, setArticulos] = useState<Articulo[]>([])
  const [articuloAEliminar, setArticuloAEliminar] = useState<Articulo | null>(null)

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "admin") {
      router.push("/login")
      return
    }
    setArticulos(obtenerArticulos())
  }, [autenticado, usuario, router])

  const toggleActivo = (id: string) => {
    const actualizados = articulos.map((a) => (a.id === id ? { ...a, activo: !a.activo } : a))
    guardarArticulos(actualizados)
    setArticulos(actualizados)
    toast.success("Estado del artículo actualizado")
  }

  const eliminarArticulo = () => {
    if (!articuloAEliminar) return
    const actualizados = articulos.filter((a) => a.id !== articuloAEliminar.id)
    guardarArticulos(actualizados)
    setArticulos(actualizados)
    setArticuloAEliminar(null)
    toast.success("Artículo eliminado correctamente")
  }

  if (!autenticado || usuario?.rol !== "admin") {
    return null
  }

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Gestión de Blog</h1>
              <p className="text-muted-foreground">Administra los artículos del blog</p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/admin/blog/nuevo">
                <Plus className="h-4 w-4" />
                Nuevo Artículo
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articulos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">No hay artículos en el blog</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    articulos.map((articulo) => (
                      <TableRow key={articulo.id}>
                        <TableCell>
                          <div className="relative w-16 h-12 rounded overflow-hidden">
                            <Image
                              src={articulo.imagen || "/placeholder.svg"}
                              alt={articulo.titulo}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{articulo.titulo}</TableCell>
                        <TableCell>{articulo.autor}</TableCell>
                        <TableCell>{articulo.fecha}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              articulo.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {articulo.activo ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleActivo(articulo.id)}
                              title={articulo.activo ? "Desactivar" : "Activar"}
                            >
                              {articulo.activo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Link href={`/admin/blog/${articulo.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setArticuloAEliminar(articulo)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!articuloAEliminar} onOpenChange={() => setArticuloAEliminar(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar artículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el artículo "{articuloAEliminar?.titulo}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={eliminarArticulo}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
