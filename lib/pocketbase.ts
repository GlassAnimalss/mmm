import PocketBase from "pocketbase"

// Crear instancia del cliente de PocketBase
// Esta URL debe coincidir con donde está corriendo tu PocketBase
export const pb = new PocketBase("http://127.0.0.1:8090")

// Deshabilitar auto-cancelación de requests
pb.autoCancellation(false)

export default pb

// Tipos específicos para las colecciones de PocketBase
export interface ProductoRecord {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  categoria: "Verduras" | "Frutas" | "Hierbas" | "Semillas"
  unidad: string
  stock: number
  disponible: boolean
  created: string
  updated: string
}
