import { NextResponse } from "next/server"
import { obtenerUsuarioActual } from "@/lib/api/auth"

export async function GET() {
  try {
    const usuario = obtenerUsuarioActual()

    if (!usuario) {
      return NextResponse.json({ error: "Usuario no autenticado" }, { status: 401 })
    }

    return NextResponse.json({ usuario }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error en API de usuario actual:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}
