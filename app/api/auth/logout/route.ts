import { NextResponse } from "next/server"
import { cerrarSesion } from "@/lib/api/auth"

export async function POST() {
  try {
    await cerrarSesion()
    return NextResponse.json({ mensaje: "Sesión cerrada correctamente" }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error en API de logout:", error)
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
