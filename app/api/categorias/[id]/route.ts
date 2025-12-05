import { NextResponse } from "next/server"
import { obtenerCategoriaAPI, actualizarCategoriaAPI, eliminarCategoriaAPI } from "@/lib/api/categorias"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoria = await obtenerCategoriaAPI(params.id)
    return NextResponse.json(categoria)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener categoría" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const categoria = await actualizarCategoriaAPI(params.id, data)
    return NextResponse.json(categoria)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar categoría" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await eliminarCategoriaAPI(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar categoría" }, { status: 500 })
  }
}
