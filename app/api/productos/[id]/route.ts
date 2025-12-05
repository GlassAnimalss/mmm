import { NextResponse } from "next/server"
import { obtenerProductoPorId, actualizarProducto, eliminarProducto } from "@/lib/api/productos"
import PocketBase from "pocketbase"
import { cookies } from "next/headers"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const producto = await obtenerProductoPorId(id)

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(producto)
  } catch (error) {
    console.error("[v0] Error obteniendo producto:", error)
    return NextResponse.json({ error: "Error obteniendo producto" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const cookieStore = await cookies()
    const pbAuthCookie = cookieStore.get("pb_auth")

    // Crear cliente PB autenticado para esta request
    const pb = new PocketBase("http://127.0.0.1:8090")
    if (pbAuthCookie) {
      // Decodificar la cookie manualmente si es necesario, o usar loadFromCookie
      const encoded = pbAuthCookie.value
      try {
        const decoded = decodeURIComponent(encoded)
        pb.authStore.save(decoded, null)
      } catch (e) {
        pb.authStore.loadFromCookie(pbAuthCookie.value)
      }

      try {
        if (pb.authStore.isValid) {
          await pb.collection("users").authRefresh()
        }
      } catch (e) {
        console.error("Error refreshing auth:", e)
      }
    }

    // Verificar si es admin
    if (!pb.authStore.isValid || pb.authStore.model?.rol !== "admin") {
      return NextResponse.json({ error: "No tienes permisos de administrador" }, { status: 403 })
    }

    // Preparar datos para actualizar
    const datosActualizar: any = {}

    if (body.nombre !== undefined) datosActualizar.nombre = body.nombre
    if (body.descripcion !== undefined) datosActualizar.descripcion = body.descripcion
    if (body.precio !== undefined) datosActualizar.precio = Number(body.precio)
    if (body.stock !== undefined) datosActualizar.stock = Number(body.stock)
    if (body.categoria !== undefined) datosActualizar.categoria = body.categoria
    if (body.imagen !== undefined) datosActualizar.imagen = body.imagen
    if (body.unidad !== undefined) datosActualizar.unidad = body.unidad
    if (body.activo !== undefined) datosActualizar.disponible = body.activo
    if (body.disponible !== undefined) datosActualizar.disponible = body.disponible

    try {
      const record = await pb.collection("productos").update(id, datosActualizar)

      // Mapear respuesta manualmente para evitar dependencias circulares o problemas de importación
      const productoActualizado = {
        id: record.id,
        nombre: record.nombre,
        descripcion: record.descripcion,
        precio: record.precio,
        stock: record.stock,
        categoria: record.categoria,
        imagen: record.imagen,
        unidad: record.unidad,
        destacado: false,
        enOferta: false,
        activo: record.disponible,
      }

      return NextResponse.json(productoActualizado)
    } catch (pbError: any) {
      console.error("PocketBase Update Error Details:", JSON.stringify(pbError.response, null, 2))
      return NextResponse.json({
        error: pbError.message || "Error de PocketBase",
        details: pbError.data
      }, { status: pbError.status || 500 })
    }
  } catch (error: any) {
    console.error("[v0] Error actualizando producto:", error)
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const pbAuthCookie = cookieStore.get("pb_auth")

    const pb = new PocketBase("http://127.0.0.1:8090")
    if (pbAuthCookie) {
      const encoded = pbAuthCookie.value
      try {
        const decoded = decodeURIComponent(encoded)
        pb.authStore.save(decoded, null)
      } catch (e) {
        pb.authStore.loadFromCookie(pbAuthCookie.value)
      }
    }

    const exito = await eliminarProducto(id, pb)

    if (!exito) {
      return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
    }

    return NextResponse.json({ mensaje: "Producto eliminado exitosamente" })
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
  }
}
