import { pb } from "@/lib/pocketbase"
import type { Usuario } from "@/lib/tipos"

// Convertir registro PB a tipo Usuario
function convertirUsuario(record: any): Usuario {
    return {
        id: record.id,
        email: record.email,
        nombre: record.nombre,
        apellido: record.apellido,
        telefono: record.telefono,
        direccion: record.direccion,
        ciudad: record.ciudad,
        region: record.region,
        codigoPostal: record.codigoPostal,
        rol: record.rol,
        fechaRegistro: record.created,
    }
}

// Obtener todos los usuarios (admin)
export async function obtenerUsuariosAPI(): Promise<Usuario[]> {
    try {
        const records = await pb.collection("users").getFullList({
            sort: "-created",
        })
        return records.map(convertirUsuario)
    } catch (error) {
        console.error("Error obteniendo usuarios:", error)
        return []
    }
}

// Obtener un usuario por ID
export async function obtenerUsuarioAPI(id: string): Promise<Usuario | null> {
    try {
        const record = await pb.collection("users").getOne(id)
        return convertirUsuario(record)
    } catch (error) {
        console.error("Error obteniendo usuario:", error)
        return null
    }
}

// Crear usuario (admin)
export async function crearUsuarioAPI(datos: any): Promise<Usuario> {
    try {
        const record = await pb.collection("users").create({
            ...datos,
            emailVisibility: true,
        })
        return convertirUsuario(record)
    } catch (error: any) {
        console.error("Error creando usuario:", error)
        throw new Error(error.message || "No se pudo crear el usuario")
    }
}

// Actualizar usuario
export async function actualizarUsuarioAPI(id: string, datos: any): Promise<Usuario> {
    try {
        const record = await pb.collection("users").update(id, datos)
        return convertirUsuario(record)
    } catch (error: any) {
        console.error("Error actualizando usuario:", error)
        throw new Error(error.message || "No se pudo actualizar el usuario")
    }
}

// Eliminar usuario
export async function eliminarUsuarioAPI(id: string): Promise<void> {
    try {
        await pb.collection("users").delete(id)
    } catch (error: any) {
        console.error("Error eliminando usuario:", error)
        throw new Error(error.message || "No se pudo eliminar el usuario")
    }
}
