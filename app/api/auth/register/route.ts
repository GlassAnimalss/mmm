import { NextResponse } from "next/server"
import { registrarUsuario } from "@/lib/api/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar campos requeridos
    if (!body.email || !body.password || !body.passwordConfirm || !body.nombre || !body.apellido) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos: email, password, passwordConfirm, nombre, apellido" },
        { status: 400 },
      )
    }

    // Validar que las contraseñas coincidan
    if (body.password !== body.passwordConfirm) {
      return NextResponse.json({ error: "Las contraseñas no coinciden" }, { status: 400 })
    }

    const { usuario, error } = await registrarUsuario({
      email: body.email,
      password: body.password,
      passwordConfirm: body.passwordConfirm,
      nombre: body.nombre,
      apellido: body.apellido,
      rol: body.rol || "cliente",
    })

    if (error || !usuario) {
      return NextResponse.json({ error: error || "Error al registrar usuario" }, { status: 400 })
    }

    return NextResponse.json({ usuario }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error en API de registro:", error)
    return NextResponse.json({ error: "Error al registrar usuario" }, { status: 500 })
  }
}
