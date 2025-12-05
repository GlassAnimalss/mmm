"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import { useToast } from "@/hooks/use-toast"
import { validarTelefonoChileno, validarEmail } from "@/lib/utilidades"

export default function PaginaContacto() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })
  const [errores, setErrores] = useState<{ telefono?: string; email?: string }>({})

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setFormData({ ...formData, telefono: valor })

    if (valor && !validarTelefonoChileno(valor)) {
      setErrores({ ...errores, telefono: "Formato inválido. Ej: 912345678 o +56912345678" })
    } else {
      setErrores({ ...errores, telefono: undefined })
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setFormData({ ...formData, email: valor })

    if (valor && !validarEmail(valor)) {
      setErrores({ ...errores, email: "El email debe contener @ y un dominio válido (ej: usuario@ejemplo.com)" })
    } else {
      setErrores({ ...errores, email: undefined })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarEmail(formData.email)) {
      toast({
        title: "Error de validación",
        description: "El formato del email no es válido. Debe contener @ y un dominio válido",
        variant: "destructive",
      })
      return
    }

    if (formData.telefono && !validarTelefonoChileno(formData.telefono)) {
      toast({
        title: "Error de validación",
        description: "El formato del teléfono no es válido",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto",
    })
    setFormData({ nombre: "", email: "", telefono: "", mensaje: "" })
    setErrores({})
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Contacto</h1>
            <p className="text-muted-foreground">Estamos aquí para ayudarte. Contáctanos y responderemos pronto</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulario */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Envíanos un mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre completo</label>
                    <Input
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={handleEmailChange}
                      placeholder="usuario@ejemplo.com"
                      className={errores.email ? "border-destructive" : ""}
                      required
                    />
                    {errores.email ? (
                      <p className="text-sm text-destructive mt-1">{errores.email}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Formato: usuario@ejemplo.com</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Teléfono</label>
                    <Input
                      type="tel"
                      value={formData.telefono}
                      onChange={handleTelefonoChange}
                      placeholder="912345678 o +56912345678"
                      className={errores.telefono ? "border-destructive" : ""}
                    />
                    {errores.telefono ? (
                      <p className="text-sm text-destructive mt-1">{errores.telefono}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-1">Formato: 912345678 o +56912345678</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Mensaje</label>
                    <Textarea
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" /> Enviar Mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Dirección</h3>
                      <p className="text-muted-foreground">
                        Av. Providencia 1234
                        <br />
                        Santiago, Chile
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Teléfono</h3>
                      <p className="text-muted-foreground">+56 9 1234 5678</p>
                      <p className="text-sm text-muted-foreground mt-1">Lunes a Viernes: 9:00 - 18:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Email</h3>
                      <p className="text-muted-foreground">contacto@huertohogar.cl</p>
                      <p className="text-sm text-muted-foreground mt-1">Responderemos en 24 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  )
}
