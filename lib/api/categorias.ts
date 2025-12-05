import PocketBase from "pocketbase"
import type { Categoria } from "@/lib/tipos"

const pb = new PocketBase("http://127.0.0.1:8090")

export async function obtenerCategoriasAPI(): Promise<Categoria[]> {
  try {
    const records = await pb.collection("categorias").getFullList({
      sort: "-created",
    })
    return records as any[]
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    throw error
  }
}

export async function crearCategoriaAPI(data: Partial<Categoria>): Promise<Categoria> {
  try {
    const record = await pb.collection("categorias").create(data)
    return record as any
  } catch (error) {
    console.error("Error al crear categoría:", error)
    throw error
  }
}

export async function obtenerCategoriaAPI(id: string): Promise<Categoria> {
  try {
    const record = await pb.collection("categorias").getOne(id)
    return record as any
  } catch (error) {
    console.error("Error al obtener categoría:", error)
    throw error
  }
}

export async function actualizarCategoriaAPI(id: string, data: Partial<Categoria>): Promise<Categoria> {
  try {
    const record = await pb.collection("categorias").update(id, data)
    return record as any
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    throw error
  }
}

export async function eliminarCategoriaAPI(id: string): Promise<void> {
  try {
    await pb.collection("categorias").delete(id)
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    throw error
  }
}