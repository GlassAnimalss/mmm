import { NextResponse } from "next/server"
import { obtenerProductos, crearProducto } from "@/lib/api/productos"
import PocketBase from "pocketbase"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const productos = await obtenerProductos()
    return NextResponse.json(productos)
  } catch (error) {
    console.error("[v0] Error en API de productos:", error)
    return NextResponse.json({ error: "Error obteniendo productos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const pbAuthCookie = cookieStore.get("pb_auth")

    // Crear cliente PB autenticado
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

    // Validar campos requeridos
    if (!body.nombre || !body.descripcion || !body.precio || !body.categoria) {
      return NextResponse.json({ error: "Campos requeridos: nombre, descripcion, precio, categoria" }, { status: 400 })
    }

    // Preparar datos para PocketBase
    const datosProducto = {
      nombre: body.nombre,
      descripcion: body.descripcion,
      precio: Number(body.precio),
      stock: Number(body.stock) || 0,
      categoria: body.categoria,
      imagen: body.imagen || "",
      unidad: body.unidad || "kg",
      disponible: body.activo !== false,
    }

    const producto = await crearProducto(datosProducto, pb)

    if (!producto) {
      return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
    }

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creando producto:", error)
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
  }
}
