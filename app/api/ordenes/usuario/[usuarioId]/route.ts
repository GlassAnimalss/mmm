import { NextResponse } from "next/server"
import { obtenerOrdenesUsuarioAPI } from "@/lib/api/ordenes"
import PocketBase from "pocketbase"

export async function GET(request: Request, { params }: { params: Promise<{ usuarioId: string }> }) {
  try {
    const { usuarioId } = await params

    // Crear cliente autenticado desde las cookies
    const pb = new PocketBase("http://127.0.0.1:8090")
    const cookie = request.headers.get("cookie") || ""
    console.log("🍪 API: Cookie recibida (longitud):", cookie.length)
    console.log("🍪 API: ¿Contiene pb_auth?:", cookie.includes("pb_auth"))
    // Intentar parsear manualmente la cookie
    try {
      const pbAuthCookie = cookie.split(';').find(c => c.trim().startsWith('pb_auth='))
      if (pbAuthCookie) {
        const rawToken = pbAuthCookie.split('=')[1]
        const token = decodeURIComponent(rawToken)
        pb.authStore.save(token, null)
        console.log("🔓 API: Token extraído y decodificado:", token.substring(0, 10) + "...")
      } else {
        pb.authStore.loadFromCookie(cookie)
      }
    } catch (e) {
      console.error("Error parseando cookie:", e)
      pb.authStore.loadFromCookie(cookie)
    }
    console.log("🔐 API: Token en store:", pb.authStore.token.substring(0, 10) + "...")
    console.log("🔐 API: Modelo en store:", pb.authStore.model)
    console.log("🔐 API: ¿Es válido?:", pb.authStore.isValid)

    console.log("🔍 API: Buscando órdenes para usuario:", usuarioId)
    console.log("🔐 API: Cliente autenticado:", pb.authStore.isValid)

    const ordenes = await obtenerOrdenesUsuarioAPI(usuarioId, pb)
    console.log("✅ API: Órdenes encontradas:", ordenes.length)
    return NextResponse.json(ordenes)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener órdenes del usuario" }, { status: 500 })
  }
}
