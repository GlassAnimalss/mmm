import { pb } from "@/lib/pocketbase"
import type { Usuario } from "@/lib/tipos"

// Helper para manejar la cookie de autenticación
function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    console.log("🍪 Auth: Guardando cookie pb_auth", token.substring(0, 10) + "...")
    document.cookie = `pb_auth=${token}; path=/; samesite=lax; max-age=604800` // 7 días
  }
}

function removeAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "pb_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict"
  }
}

export interface UsuarioRecord {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
  ciudad?: string
  region?: string
  codigoPostal?: string
  rol: "admin" | "cliente"
  avatar?: string
  created: string
  updated: string
}

// Convertir UsuarioRecord de PocketBase a Usuario de la app
function convertirUsuario(record: UsuarioRecord): Usuario {
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

// Registrar nuevo usuario
export async function registrarUsuario(datos: {
  email: string
  password: string
  passwordConfirm: string
  nombre: string
  apellido: string
  rol?: "admin" | "cliente"
}): Promise<{ usuario: Usuario | null; error: string | null }> {
  try {
    // Crear usuario en PocketBase
    const record = await pb.collection("users").create<UsuarioRecord>({
      email: datos.email,
      password: datos.password,
      passwordConfirm: datos.passwordConfirm,
      nombre: datos.nombre,
      apellido: datos.apellido,
      rol: datos.rol || "cliente",
      emailVisibility: true,
    })

    // Autenticar automáticamente después del registro
    await pb.collection("users").authWithPassword(datos.email, datos.password)

    // Sincronizar cookie
    setAuthCookie(pb.authStore.token)

    return {
      usuario: convertirUsuario(record),
      error: null,
    }
  } catch (error: any) {
    console.error("[v0] Error en registro:", error)
    return {
      usuario: null,
      error: error.message || "Error al registrar usuario",
    }
  }
}

// Iniciar sesión
export async function iniciarSesion(
  email: string,
  password: string,
): Promise<{ usuario: Usuario | null; error: string | null }> {
  try {
    const authData = await pb.collection("users").authWithPassword(email, password)

    // Sincronizar cookie
    setAuthCookie(pb.authStore.token)

    if (!authData.record) {
      return {
        usuario: null,
        error: "No se pudo obtener la información del usuario",
      }
    }

    return {
      usuario: convertirUsuario(authData.record as UsuarioRecord),
      error: null,
    }
  } catch (error: any) {
    console.error("[v0] Error en inicio de sesión:", error)
    return {
      usuario: null,
      error: "Email o contraseña incorrectos",
    }
  }
}

// Cerrar sesión
export async function cerrarSesion(): Promise<void> {
  pb.authStore.clear()
  removeAuthCookie()
}

// Obtener usuario actual
export function obtenerUsuarioActual(): Usuario | null {
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return null
  }

  return convertirUsuario(pb.authStore.model as UsuarioRecord)
}

// Verificar si el usuario está autenticado
export function estaAutenticado(): boolean {
  return pb.authStore.isValid
}

// Verificar si el usuario es admin
export function esAdmin(): boolean {
  if (!pb.authStore.isValid || !pb.authStore.model) {
    return false
  }

  const usuario = pb.authStore.model as UsuarioRecord
  return usuario.rol === "admin"
}

// Actualizar perfil de usuario
export async function actualizarPerfil(
  datos: Partial<Omit<UsuarioRecord, "id" | "created" | "updated" | "email">>,
): Promise<{ usuario: Usuario | null; error: string | null }> {
  try {
    if (!pb.authStore.model?.id) {
      return {
        usuario: null,
        error: "Usuario no autenticado",
      }
    }

    const record = await pb.collection("users").update<UsuarioRecord>(pb.authStore.model.id, datos)

    return {
      usuario: convertirUsuario(record),
      error: null,
    }
  } catch (error: any) {
    console.error("[v0] Error actualizando perfil:", error)
    return {
      usuario: null,
      error: error.message || "Error al actualizar perfil",
    }
  }
}

// Refrescar sesión (útil para mantener la sesión activa)
export async function refrescarSesion(): Promise<boolean> {
  try {
    if (!pb.authStore.isValid) {
      return false
    }

    await pb.collection("users").authRefresh()

    // Actualizar cookie si hay token válido
    if (pb.authStore.token) {
      setAuthCookie(pb.authStore.token)
    }

    return true
  } catch (error) {
    console.error("[v0] Error refrescando sesión:", error)
    return false
  }
}
