import { NextResponse } from "next/server"
import { obtenerOrdenesAPI, crearOrdenAPI } from "@/lib/api/ordenes"
import PocketBase from "pocketbase"
import { cookies } from "next/headers"

export async function GET() {
  try {
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

    // Intentar refrescar para obtener el modelo de usuario si el token es válido
    if (pb.authStore.isValid && !pb.authStore.model) {
      try {
        await pb.collection("users").authRefresh()
      } catch (e) {
        console.warn("⚠️ API Ordenes: Could not refresh auth:", e)
      }
    }

    // Debug logs
    console.log("🔍 API Ordenes: Auth valid?", pb.authStore.isValid)
    console.log("🔍 API Ordenes: User role?", pb.authStore.model?.rol)

    const ordenes = await obtenerOrdenesAPI(pb)
    console.log("🔍 API Ordenes: Found orders:", ordenes.length)

    return NextResponse.json(ordenes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener órdenes" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const orden = await crearOrdenAPI(data)
    return NextResponse.json(orden, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear orden" }, { status: 500 })
  }
}
