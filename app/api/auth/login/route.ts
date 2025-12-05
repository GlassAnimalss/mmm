import { NextResponse } from "next/server"
import { iniciarSesion } from "@/lib/api/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.email || !body.password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    const { usuario, error } = await iniciarSesion(body.email, body.password)

    if (error || !usuario) {
      return NextResponse.json({ error: error || "Error al iniciar sesión" }, { status: 401 })
    }

    return NextResponse.json({ usuario }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error en API de login:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
