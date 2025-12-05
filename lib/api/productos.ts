import { pb, type ProductoRecord } from "@/lib/pocketbase"
import type { Producto } from "@/lib/tipos"

// Convertir ProductoRecord de PocketBase a Producto de la app
function convertirProducto(record: ProductoRecord): Producto {
  return {
    id: record.id,
    nombre: record.nombre,
    descripcion: record.descripcion,
    precio: record.precio,
    stock: record.stock,
    categoria: record.categoria,
    imagen: record.imagen,
    unidad: record.unidad,
    destacado: false, // Puedes agregar este campo a PocketBase después
    enOferta: false, // Puedes agregar este campo a PocketBase después
    activo: record.disponible,
  }
}

// Obtener todos los productos
export async function obtenerProductos(): Promise<Producto[]> {
  try {
    const records = await pb.collection("productos").getFullList<ProductoRecord>({
      sort: "-created",
    })
    return records.map(convertirProducto)
  } catch (error) {
    console.error("[v0] Error obteniendo productos:", error)
    return []
  }
}

// Obtener un producto por ID
export async function obtenerProductoPorId(id: string): Promise<Producto | null> {
  try {
    const record = await pb.collection("productos").getOne<ProductoRecord>(id)
    return convertirProducto(record)
  } catch (error) {
    console.error("[v0] Error obteniendo producto:", error)
    return null
  }
}

// Obtener múltiples productos por sus IDs
export async function obtenerProductosPorIds(ids: string[]): Promise<Producto[]> {
  try {
    if (ids.length === 0) return []
    // PocketBase filter: id="id1" || id="id2" ...
    const filter = ids.map((id) => `id="${id}"`).join(" || ")
    const records = await pb.collection("productos").getFullList<ProductoRecord>({
      filter: filter,
    })
    return records.map(convertirProducto)
  } catch (error) {
    console.error("[v0] Error obteniendo productos por IDs:", error)
    return []
  }
}

// Obtener productos por categoría
export async function obtenerProductosPorCategoria(categoria: string): Promise<Producto[]> {
  try {
    const records = await pb.collection("productos").getFullList<ProductoRecord>({
      filter: `categoria = "${categoria}"`,
      sort: "-created",
    })
    return records.map(convertirProducto)
  } catch (error) {
    console.error("[v0] Error obteniendo productos por categoría:", error)
    return []
  }
}

// Crear un nuevo producto (para admin)
export async function crearProducto(
  datos: Omit<ProductoRecord, "id" | "created" | "updated">,
  pbClient?: any
): Promise<Producto | null> {
  try {
    const client = pbClient || pb
    const record = await client.collection("productos").create(datos)
    return convertirProducto(record)
  } catch (error) {
    console.error("[v0] Error creando producto:", error)
    return null
  }
}

// Actualizar un producto (para admin)
export async function actualizarProducto(
  id: string,
  datos: Partial<Omit<ProductoRecord, "id" | "created" | "updated">>,
  pbClient?: any
): Promise<Producto | null> {
  try {
    const client = pbClient || pb
    const record = await client.collection("productos").update(id, datos)
    return convertirProducto(record)
  } catch (error: any) {
    if (error.status === 403) {
      console.warn("Aviso: No se pudo actualizar el stock por falta de permisos (403). Esto es normal si no eres admin.")
      return null
    }
    console.error("[v0] Error actualizando producto:", error)
    console.error("[v0] Error details:", error.data)
    return null
  }
}

// Eliminar un producto (para admin)
export async function eliminarProducto(id: string, pbClient?: any): Promise<boolean> {
  try {
    const client = pbClient || pb
    await client.collection("productos").delete(id)
    return true
  } catch (error) {
    console.error("[v0] Error eliminando producto:", error)
    return false
  }
}
