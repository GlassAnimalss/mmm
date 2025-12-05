import pb from "@/lib/pocketbase"
import type { Orden } from "@/lib/tipos"

// Obtener todas las órdenes (admin)
export async function obtenerOrdenesAPI(pbClient?: any): Promise<Orden[]> {
  try {
    const client = pbClient || pb
    const records = await client.collection("pedidos").getFullList({
      sort: "-created",
      expand: "usuario",
    })

    return records.map((record: any) => {
      let direccionEnvio = {}
      try {
        if (typeof record.direccion_envio === "string") {
          direccionEnvio = JSON.parse(record.direccion_envio)
        } else {
          direccionEnvio = record.direccion_envio || {}
        }
      } catch (e) {
        console.error("Error parseando dirección:", e)
      }

      return {
        id: record.id,
        usuarioId: record.usuario,
        items: record.productos || [],
        subtotal: record.total || 0,
        envio: 0,
        total: record.total || 0,
        estado: record.estado || "pendiente",
        direccionEnvio: direccionEnvio,
        metodoPago: record.pago || "",
        notas: record.notas || "",
        fechaCreacion: record.created,
        fechaActualizacion: record.updated,
      }
    })
  } catch (error) {
    console.error("Error al obtener órdenes:", error)
    throw new Error("No se pudieron cargar las órdenes")
  }
}

import PocketBase from "pocketbase"

// Obtener órdenes de un usuario específico
export async function obtenerOrdenesUsuarioAPI(usuarioId: string, pbClient: PocketBase = pb): Promise<Orden[]> {
  try {
    console.log("📚 Lib: Filtro usado:", `usuario = "${usuarioId}"`)
    const records = await pbClient.collection("pedidos").getFullList({
      filter: `usuario = "${usuarioId}"`,
      sort: "-created",
    })
    console.log("📚 Lib: Registros raw encontrados:", records.length)

    return records.map((record: any) => {
      let direccionEnvio = {}
      try {
        if (typeof record.direccion_envio === "string") {
          direccionEnvio = JSON.parse(record.direccion_envio)
        } else {
          direccionEnvio = record.direccion_envio || {}
        }
      } catch (e) {
        console.error("Error parseando dirección:", e)
      }

      return {
        id: record.id,
        usuarioId: record.usuario,
        items: record.productos || [],
        subtotal: record.total || 0,
        envio: 0,
        total: record.total || 0,
        estado: record.estado || "pendiente",
        direccionEnvio: direccionEnvio,
        metodoPago: record.pago || "",
        notas: record.notas || "",
        fechaCreacion: record.created,
        fechaActualizacion: record.updated,
      }
    })
  } catch (error) {
    console.error("Error al obtener órdenes del usuario:", error)
    throw new Error("No se pudieron cargar las órdenes")
  }
}

// Obtener una orden por ID
export async function obtenerOrdenAPI(id: string): Promise<Orden> {
  try {
    const record = await pb.collection("pedidos").getOne(id, {
      expand: "usuario",
    })

    let direccionEnvio = {}
    try {
      if (typeof record.direccion_envio === "string") {
        direccionEnvio = JSON.parse(record.direccion_envio)
      } else {
        direccionEnvio = record.direccion_envio || {}
      }
    } catch (e) {
      console.error("Error parseando dirección:", e)
    }

    return {
      id: record.id,
      usuarioId: record.usuario,
      items: record.productos || [],
      subtotal: record.total || 0,
      envio: 0,
      total: record.total || 0,
      estado: record.estado || "pendiente",
      direccionEnvio: direccionEnvio,
      metodoPago: record.pago || "",
      notas: record.notas || "",
      fechaCreacion: record.created,
      fechaActualizacion: record.updated,
    }
  } catch (error) {
    console.error("Error al obtener orden:", error)
    throw new Error("No se pudo cargar la orden")
  }
}

// Crear una nueva orden
export async function crearOrdenAPI(data: {
  usuarioId: string
  items: any[]
  total: number
  direccionEnvio: any
  metodoPago: string
  notas?: string
}): Promise<Orden> {
  try {
    console.log("🚀 API: Intentando crear orden con datos:", {
      usuario: data.usuarioId,
      total: data.total,
      estado: "pendiente",
    })

    const record = await pb.collection("pedidos").create({
      usuario: data.usuarioId,
      productos: data.items,
      total: data.total,
      estado: "pendiente",
      direccion_envio: data.direccionEnvio, // Enviar objeto directo para campo JSON
      pago: data.metodoPago,
      notas: data.notas || "",
    })

    console.log("✅ API: Orden creada exitosamente:", record.id)

    return {
      id: record.id,
      usuarioId: record.usuario,
      items: record.productos || [],
      subtotal: record.total || 0,
      envio: 0,
      total: record.total || 0,
      estado: record.estado || "pendiente",
      direccionEnvio: data.direccionEnvio,
      metodoPago: record.pago || "",
      notas: record.notas || "",
      fechaCreacion: record.created,
      fechaActualizacion: record.updated,
    }
  } catch (error: any) {
    console.error("❌ API: Error al crear orden:", error)
    console.error("❌ API: Detalles del error:", error.data)
    throw new Error("No se pudo crear la orden: " + (error.message || "Error desconocido"))
  }
}

// Actualizar el estado de una orden
export async function actualizarEstadoOrdenAPI(id: string, estado: string): Promise<Orden> {
  try {
    const record = await pb.collection("pedidos").update(id, {
      estado,
    })

    let direccionEnvio = {}
    try {
      if (typeof record.direccion_envio === "string") {
        direccionEnvio = JSON.parse(record.direccion_envio)
      } else {
        direccionEnvio = record.direccion_envio || {}
      }
    } catch (e) {
      console.error("Error parseando dirección:", e)
    }

    return {
      id: record.id,
      usuarioId: record.usuario,
      items: record.productos || [],
      subtotal: record.total || 0, // PocketBase no tiene subtotal separado por defecto
      envio: 0, // PocketBase no tiene envio separado por defecto
      total: record.total || 0,
      estado: record.estado || "pendiente",
      direccionEnvio: direccionEnvio,
      metodoPago: record.pago || "",
      notas: record.notas || "",
      fechaCreacion: record.created,
      fechaActualizacion: record.updated,
    }
  } catch (error) {
    console.error("Error al actualizar estado de orden:", error)
    throw new Error("No se pudo actualizar el estado de la orden")
  }
}

// Eliminar una orden
export async function eliminarOrdenAPI(id: string): Promise<void> {
  try {
    await pb.collection("pedidos").delete(id)
  } catch (error) {
    console.error("Error al eliminar orden:", error)
    throw new Error("No se pudo eliminar la orden")
  }
}
