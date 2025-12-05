"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Edit, User, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { useAuth } from "@/contextos/ContextoAuth"
import { useToast } from "@/hooks/use-toast"
import { validarEmail, validarTelefonoChileno, formatearTelefonoChileno, regionesChile } from "@/lib/utilidades"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaginaPerfil() {
  const router = useRouter()
  const { usuario, autenticado, actualizarUsuario } = useAuth()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    region: "",
    codigoPostal: "",
  })

  useEffect(() => {
    if (!autenticado) {
      router.push("/login")
      return
    }

    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
        ciudad: usuario.ciudad || "",
        region: usuario.region || "",
        codigoPostal: usuario.codigoPostal || "",
      })
    }
  }, [autenticado, usuario, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.region) {
      toast({
        title: "Región requerida",
        description: "Por favor selecciona una región",
        variant: "destructive",
      })
      return
    }

    if (!validarEmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive",
      })
      return
    }

    if (!validarTelefonoChileno(formData.telefono)) {
      toast({
        title: "Teléfono inválido",
        description: "Por favor ingresa un número chileno válido (ej: +56 9 1234 5678 o 912345678)",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const usuarioActualizado = {
        ...formData,
        telefono: formatearTelefonoChileno(formData.telefono),
      }

      await actualizarUsuario(usuarioActualizado)

      toast({
        title: "Cambios guardados exitosamente",
        description: "Tu información personal y dirección han sido actualizadas correctamente.",
        variant: "default",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Error al actualizar perfil",
        description: error instanceof Error ? error.message : "Por favor intenta nuevamente",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!autenticado || !usuario) {
    return null
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/mi-cuenta">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Mi Cuenta
            </Button>
          </Link>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Mi Perfil</h1>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Edit className="h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </div>

          {!isEditing ? (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Nombre</p>
                      <p className="text-base font-medium">{usuario.nombre || "No especificado"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Apellido</p>
                      <p className="text-base font-medium">{usuario.apellido || "No especificado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-base font-medium">{usuario.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                      <p className="text-base font-medium">{usuario.telefono || "No especificado"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Dirección</p>
                    <p className="text-base font-medium">{usuario.direccion || "No especificada"}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Ciudad</p>
                      <p className="text-base font-medium">{usuario.ciudad || "No especificada"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Región</p>
                      <p className="text-base font-medium">{usuario.region || "No especificada"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Código Postal</p>
                    <p className="text-base font-medium">{usuario.codigoPostal || "No especificado"}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="+56 9 1234 5678"
                      required
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Formato: +56 9 1234 5678 o 912345678</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Dirección</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="direccion">Dirección</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ciudad">Ciudad</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">
                        Región <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData({ ...formData, region: value })}
                        disabled={isLoading}
                        required
                      >
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Selecciona una región" />
                        </SelectTrigger>
                        <SelectContent>
                          {regionesChile.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">Campo obligatorio</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="codigoPostal">Código Postal</Label>
                    <Input
                      id="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    if (usuario) {
                      setFormData({
                        nombre: usuario.nombre || "",
                        apellido: usuario.apellido || "",
                        email: usuario.email || "",
                        telefono: usuario.telefono || "",
                        direccion: usuario.direccion || "",
                        ciudad: usuario.ciudad || "",
                        region: usuario.region || "",
                        codigoPostal: usuario.codigoPostal || "",
                      })
                    }
                  }}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      Guardando cambios...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Guardar Cambios
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  )
}
