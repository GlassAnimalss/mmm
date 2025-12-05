"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"

export default function PaginaLogin() {
  const router = useRouter()
  const { iniciarSesion, registrarse } = useAuth()
  const { toast } = useToast()

  const [modoRegistro, setModoRegistro] = useState(false)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [cargando, setCargando] = useState(false)

  const [errores, setErrores] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmarPassword: "",
  })

  const validarFormulario = (): boolean => {
    const nuevosErrores = {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmarPassword: "",
    }

    let valido = true

    if (modoRegistro && !nombre.trim()) {
      nuevosErrores.nombre = "Debes ingresar tu nombre"
      valido = false
    }

    if (modoRegistro && !apellido.trim()) {
      nuevosErrores.apellido = "Debes ingresar tu apellido"
      valido = false
    }

    if (!email.includes("@")) {
      nuevosErrores.email = "El email debe contener un @"
      valido = false
    } else if (!email.includes(".")) {
      nuevosErrores.email = "El email debe contener un punto (.)"
      valido = false
    }

    if (password.length < 8) {
      nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres"
      valido = false
    }

    if (modoRegistro && password !== confirmarPassword) {
      nuevosErrores.confirmarPassword = "Las contraseñas no coinciden"
      valido = false
    }

    setErrores(nuevosErrores)
    return valido
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarFormulario()) {
      return
    }

    setCargando(true)

    if (modoRegistro) {
      try {
        await registrarse({
          email,
          password,
          passwordConfirm: confirmarPassword,
          nombre: nombre.trim(),
          apellido: apellido.trim(),
        })

        toast({
          title: "Cuenta creada",
          description: "Bienvenido a Huerto Hogar",
        })
        router.push("/")
      } catch (error) {
        toast({
          title: "Error al crear cuenta",
          description: error instanceof Error ? error.message : "Intenta nuevamente",
          variant: "destructive",
        })
      }
      setCargando(false)
      return
    }

    const exito = await iniciarSesion(email, password)

    if (exito) {
      toast({
        title: "Sesión iniciada",
        description: "Bienvenido a Huerto Hogar",
      })

      router.push("/")
    } else {
      toast({
        title: "Error al iniciar sesión",
        description: "Email o contraseña incorrectos",
        variant: "destructive",
      })
    }

    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 to-secondary/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="text-3xl">🌱</div>
            <span className="text-2xl font-bold text-primary">Huerto Hogar</span>
          </div>
          <CardTitle className="text-2xl">{modoRegistro ? "Crear Cuenta" : "Iniciar Sesión"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {modoRegistro && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nombre</label>
                  <Input
                    type="text"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value)
                      setErrores({ ...errores, nombre: "" })
                    }}
                    placeholder="Juan"
                    className={errores.nombre ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                  {errores.nombre && <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Apellido</label>
                  <Input
                    type="text"
                    value={apellido}
                    onChange={(e) => {
                      setApellido(e.target.value)
                      setErrores({ ...errores, apellido: "" })
                    }}
                    placeholder="Pérez"
                    className={errores.apellido ? "border-red-500 focus-visible:ring-red-500" : ""}
                    required
                  />
                  {errores.apellido && <p className="text-xs text-red-500 mt-1">{errores.apellido}</p>}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrores({ ...errores, email: "" })
                }}
                placeholder="tu@email.cl"
                className={errores.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errores.email && <p className="text-xs text-red-500 mt-1">{errores.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrores({ ...errores, password: "" })
                }}
                placeholder="••••••••"
                className={errores.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {errores.password && <p className="text-xs text-red-500 mt-1">{errores.password}</p>}
              {modoRegistro && !errores.password && (
                <p className="text-xs text-muted-foreground mt-1">Mínimo 8 caracteres</p>
              )}
            </div>

            {modoRegistro && (
              <div>
                <label className="text-sm font-medium mb-2 block">Confirmar Contraseña</label>
                <Input
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => {
                    setConfirmarPassword(e.target.value)
                    setErrores({ ...errores, confirmarPassword: "" })
                  }}
                  placeholder="••••••••"
                  className={errores.confirmarPassword ? "border-red-500 focus-visible:ring-red-500" : ""}
                  required
                />
                {errores.confirmarPassword && <p className="text-xs text-red-500 mt-1">{errores.confirmarPassword}</p>}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={cargando}>
              {cargando
                ? modoRegistro
                  ? "Creando cuenta..."
                  : "Iniciando sesión..."
                : modoRegistro
                  ? "Crear Cuenta"
                  : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setModoRegistro(!modoRegistro)
                setNombre("")
                setApellido("")
                setEmail("")
                setPassword("")
                setConfirmarPassword("")
                setErrores({
                  nombre: "",
                  apellido: "",
                  email: "",
                  password: "",
                  confirmarPassword: "",
                })
              }}
              className="text-sm text-primary hover:underline"
            >
              {modoRegistro ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Créate una"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-primary hover:underline">
              Volver al inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
