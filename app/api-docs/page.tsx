"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Database, Lock, ShoppingCart, Layers } from "lucide-react"
import NavegacionPublica from "@/componentes/NavegacionPublica"

export default function PaginaDocumentacionAPI() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  const endpoints = {
    auth: [
      {
        method: "POST",
        path: "/api/auth/register",
        description: "Registrar un nuevo usuario",
        auth: false,
        body: {
          email: "usuario@ejemplo.cl",
          password: "contraseña123",
          passwordConfirm: "contraseña123",
          nombre: "Juan",
          apellido: "Pérez",
        },
        response: {
          id: "1234567890",
          email: "usuario@ejemplo.cl",
          nombre: "Juan",
          apellido: "Pérez",
          rol: "cliente",
        },
      },
      {
        method: "POST",
        path: "/api/auth/login",
        description: "Iniciar sesión",
        auth: false,
        body: {
          email: "usuario@ejemplo.cl",
          password: "contraseña123",
        },
        response: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            id: "1234567890",
            email: "usuario@ejemplo.cl",
            nombre: "Juan",
            rol: "cliente",
          },
        },
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        description: "Cerrar sesión",
        auth: true,
        response: {
          success: true,
        },
      },
      {
        method: "GET",
        path: "/api/auth/me",
        description: "Obtener información del usuario actual",
        auth: true,
        response: {
          id: "1234567890",
          email: "usuario@ejemplo.cl",
          nombre: "Juan",
          apellido: "Pérez",
          rol: "cliente",
        },
      },
    ],
    productos: [
      {
        method: "GET",
        path: "/api/productos",
        description: "Obtener todos los productos",
        auth: false,
        response: [
          {
            id: "1",
            nombre: "Manzanas Rojas",
            descripcion: "Manzanas frescas",
            precio: 1990,
            stock: 50,
            categoria: "1",
            imagen: "url",
          },
        ],
      },
      {
        method: "GET",
        path: "/api/productos/[id]",
        description: "Obtener un producto específico",
        auth: false,
        response: {
          id: "1",
          nombre: "Manzanas Rojas",
          precio: 1990,
        },
      },
      {
        method: "POST",
        path: "/api/productos",
        description: "Crear un nuevo producto (Admin)",
        auth: true,
        body: {
          nombre: "Nuevo Producto",
          descripcion: "Descripción",
          precio: 2990,
          stock: 100,
          categoria: "1",
        },
      },
      {
        method: "PUT",
        path: "/api/productos/[id]",
        description: "Actualizar un producto (Admin)",
        auth: true,
        body: {
          nombre: "Producto Actualizado",
          precio: 3990,
        },
      },
      {
        method: "DELETE",
        path: "/api/productos/[id]",
        description: "Eliminar un producto (Admin)",
        auth: true,
        response: {
          success: true,
        },
      },
    ],
    categorias: [
      {
        method: "GET",
        path: "/api/categorias",
        description: "Obtener todas las categorías",
        auth: false,
        response: [
          {
            id: "1",
            nombre: "Frutas Frescas",
            descripcion: "Frutas de temporada",
            activa: true,
          },
        ],
      },
      {
        method: "GET",
        path: "/api/categorias/[id]",
        description: "Obtener una categoría específica",
        auth: false,
      },
      {
        method: "POST",
        path: "/api/categorias",
        description: "Crear una nueva categoría (Admin)",
        auth: true,
        body: {
          nombre: "Nueva Categoría",
          descripcion: "Descripción",
          activa: true,
        },
      },
      {
        method: "PUT",
        path: "/api/categorias/[id]",
        description: "Actualizar una categoría (Admin)",
        auth: true,
      },
      {
        method: "DELETE",
        path: "/api/categorias/[id]",
        description: "Eliminar una categoría (Admin)",
        auth: true,
      },
    ],
    ordenes: [
      {
        method: "GET",
        path: "/api/ordenes",
        description: "Obtener todas las órdenes (Admin)",
        auth: true,
        response: [
          {
            id: "1",
            usuarioId: "123",
            items: [],
            total: 10000,
            estado: "pendiente",
          },
        ],
      },
      {
        method: "GET",
        path: "/api/ordenes/[id]",
        description: "Obtener una orden específica",
        auth: true,
      },
      {
        method: "GET",
        path: "/api/ordenes/usuario/[usuarioId]",
        description: "Obtener órdenes de un usuario",
        auth: true,
      },
      {
        method: "POST",
        path: "/api/ordenes",
        description: "Crear una nueva orden",
        auth: true,
        body: {
          usuarioId: "123",
          items: [{ productoId: "1", cantidad: 2 }],
          total: 3980,
          direccionEnvio: {},
          metodoPago: "transferencia",
        },
      },
      {
        method: "PUT",
        path: "/api/ordenes/[id]",
        description: "Actualizar estado de orden (Admin)",
        auth: true,
        body: {
          estado: "procesando",
        },
      },
      {
        method: "DELETE",
        path: "/api/ordenes/[id]",
        description: "Eliminar una orden (Admin)",
        auth: true,
      },
    ],
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-green-500"
      case "POST":
        return "bg-blue-500"
      case "PUT":
        return "bg-yellow-500"
      case "DELETE":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionPublica />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Documentación API REST - Huerto Hogar</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Documentación completa de los endpoints de la API para el sistema de e-commerce
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className="bg-muted px-3 py-1 rounded text-sm">
                  {typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Autenticación</h3>
                <p className="text-muted-foreground text-sm">
                  La API utiliza JWT (JSON Web Tokens) para autenticación. Los endpoints protegidos requieren el token
                  en el header Authorization.
                </p>
                <code className="bg-muted px-3 py-1 rounded text-sm block mt-2">Authorization: Bearer {"<token>"}</code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Formato de Respuesta</h3>
                <p className="text-muted-foreground text-sm">Todas las respuestas están en formato JSON.</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="auth" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Autenticación
              </TabsTrigger>
              <TabsTrigger value="productos" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="categorias" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Categorías
              </TabsTrigger>
              <TabsTrigger value="ordenes" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Órdenes
              </TabsTrigger>
            </TabsList>

            {Object.entries(endpoints).map(([key, endpointList]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                {endpointList.map((endpoint, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getMethodColor(endpoint.method)} text-white`}>{endpoint.method}</Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        {endpoint.auth && (
                          <Badge variant="outline" className="gap-1">
                            <Lock className="h-3 w-3" />
                            Requiere Auth
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{endpoint.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {endpoint.body && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Request Body:</h4>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(endpoint.body, null, 2)}
                          </pre>
                        </div>
                      )}
                      {endpoint.response && (
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Response:</h4>
                          <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(endpoint.response, null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Códigos de Estado HTTP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Badge className="bg-green-500 text-white mb-2">200 OK</Badge>
                  <p className="text-sm text-muted-foreground">Solicitud exitosa</p>
                </div>
                <div>
                  <Badge className="bg-blue-500 text-white mb-2">201 Created</Badge>
                  <p className="text-sm text-muted-foreground">Recurso creado exitosamente</p>
                </div>
                <div>
                  <Badge className="bg-yellow-500 text-white mb-2">400 Bad Request</Badge>
                  <p className="text-sm text-muted-foreground">Datos inválidos en la solicitud</p>
                </div>
                <div>
                  <Badge className="bg-red-500 text-white mb-2">401 Unauthorized</Badge>
                  <p className="text-sm text-muted-foreground">No autenticado</p>
                </div>
                <div>
                  <Badge className="bg-red-500 text-white mb-2">403 Forbidden</Badge>
                  <p className="text-sm text-muted-foreground">Sin permisos suficientes</p>
                </div>
                <div>
                  <Badge className="bg-red-500 text-white mb-2">404 Not Found</Badge>
                  <p className="text-sm text-muted-foreground">Recurso no encontrado</p>
                </div>
                <div>
                  <Badge className="bg-red-500 text-white mb-2">500 Internal Server Error</Badge>
                  <p className="text-sm text-muted-foreground">Error del servidor</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
