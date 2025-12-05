import { NextResponse } from "next/server"
import { obtenerOrdenAPI, actualizarEstadoOrdenAPI, eliminarOrdenAPI } from "@/lib/api/ordenes"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const orden = await obtenerOrdenAPI(id)
    return NextResponse.json(orden)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener orden" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { estado } = await request.json()
    const orden = await actualizarEstadoOrdenAPI(id, estado)
    return NextResponse.json(orden)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al actualizar orden" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await eliminarOrdenAPI(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al eliminar orden" }, { status: 500 })
  }
}
