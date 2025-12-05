import { NextResponse } from "next/server"
import { obtenerCategoriasAPI, crearCategoriaAPI } from "@/lib/api/categorias"

export async function GET() {
  try {
    const categorias = await obtenerCategoriasAPI()
    return NextResponse.json(categorias)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al obtener categorías" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const categoria = await crearCategoriaAPI(data)
    return NextResponse.json(categoria, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear categoría" }, { status: 500 })
  }
}
