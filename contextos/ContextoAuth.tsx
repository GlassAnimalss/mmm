"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Usuario, EstadoAuth } from "@/lib/tipos"
import {
  iniciarSesion as iniciarSesionPB,
  cerrarSesion as cerrarSesionPB,
  registrarUsuario as registrarUsuarioPB,
  obtenerUsuarioActual as obtenerUsuarioActualPB,
  actualizarPerfil as actualizarPerfilPB,
  refrescarSesion,
} from "@/lib/api/auth"

interface ContextoAuthType extends EstadoAuth {
  iniciarSesion: (email: string, password: string) => Promise<boolean>
  cerrarSesion: () => void
  actualizarUsuario: (datos: Partial<Usuario>) => Promise<boolean>
  registrarse: (datos: {
    email: string
    password: string
    passwordConfirm: string
    nombre: string
    apellido: string
  }) => Promise<void>
}

const ContextoAuth = createContext<ContextoAuthType | undefined>(undefined)

export function ProveedorAuth({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<EstadoAuth>({
    usuario: null,
    autenticado: false,
  })
  const [inicializado, setInicializado] = useState(false)

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        // Intentar refrescar la sesión
        const sesionValida = await refrescarSesion()

        if (sesionValida) {
          const usuario = obtenerUsuarioActualPB()
          if (usuario) {
            setEstado({ usuario, autenticado: true })
          }
        }
      } catch (error) {
        console.error("[v0] Error verificando sesión:", error)
      } finally {
        setInicializado(true)
      }
    }

    verificarSesion()
  }, [])

  const iniciarSesion = async (email: string, password: string): Promise<boolean> => {
    try {
      const { usuario, error } = await iniciarSesionPB(email, password)

      if (error || !usuario) {
        console.error("[v0] Error iniciando sesión:", error)
        return false
      }

      setEstado({ usuario, autenticado: true })
      return true
    } catch (error) {
      console.error("[v0] Error en iniciarSesion:", error)
      return false
    }
  }

  const cerrarSesion = () => {
    cerrarSesionPB()
    setEstado({ usuario: null, autenticado: false })
  }

  const actualizarUsuario = async (datos: Partial<Usuario>): Promise<boolean> => {
    try {
      const { usuario, error } = await actualizarPerfilPB(datos)

      if (error || !usuario) {
        console.error("[v0] Error actualizando perfil:", error)
        return false
      }

      setEstado({ usuario, autenticado: true })
      return true
    } catch (error) {
      console.error("[v0] Error en actualizarUsuario:", error)
      return false
    }
  }

  const registrarse = async (datos: {
    email: string
    password: string
    passwordConfirm: string
    nombre: string
    apellido: string
  }): Promise<void> => {
    const { usuario, error } = await registrarUsuarioPB({
      ...datos,
      rol: "cliente",
    })

    if (error || !usuario) {
      throw new Error(error || "Error al registrar usuario")
    }

    setEstado({ usuario, autenticado: true })
  }

  if (!inicializado) {
    return null
  }

  return (
    <ContextoAuth.Provider value={{ ...estado, iniciarSesion, cerrarSesion, actualizarUsuario, registrarse }}>
      {children}
    </ContextoAuth.Provider>
  )
}

export function useAuth() {
  const context = useContext(ContextoAuth)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un ProveedorAuth")
  }
  return context
}
