'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NavegacionAdmin from '@/componentes/NavegacionAdmin';
import { useAuth } from '@/contextos/ContextoAuth';
import { useCarrito } from '@/contextos/ContextoCarrito';
import { obtenerUsuarioAPI } from '@/lib/api/usuarios';
import { obtenerOrdenesUsuarioAPI } from '@/lib/api/ordenes';
import { Usuario, Orden, Producto } from '@/lib/tipos';
import { formatearPrecio } from '@/lib/utilidades';

import { obtenerProductosPorIds } from "@/lib/api/productos";

export default function PaginaDetalleUsuario() {
  const params = useParams();
  const router = useRouter();
  const { usuario: usuarioActual, autenticado } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [productosMap, setProductosMap] = useState<Record<string, Producto>>({});

  useEffect(() => {
    if (!autenticado || usuarioActual?.rol !== 'admin') {
      router.push('/login');
      return;
    }

    const cargarDatos = async () => {
      try {
        const id = params.id as string;
        const usuarioEncontrado = await obtenerUsuarioAPI(id);

        if (usuarioEncontrado) {
          setUsuario(usuarioEncontrado);

          const ordenesUsuario = await obtenerOrdenesUsuarioAPI(id);
          setOrdenes(ordenesUsuario);

          // Obtener productos
          const todosLosProductosIds = new Set<string>();
          ordenesUsuario.forEach((orden) => {
            orden.items.forEach((item) => todosLosProductosIds.add(item.productoId));
          });

          const productos = await obtenerProductosPorIds(Array.from(todosLosProductosIds));
          const map: Record<string, Producto> = {};
          productos.forEach((p) => {
            map[p.id] = p;
          });
          setProductosMap(map);
        }
      } catch (error) {
        console.error("Error cargando detalle usuario:", error);
      }
    };

    cargarDatos();
  }, [params.id, autenticado, usuarioActual, router]);

  if (!autenticado || usuarioActual?.rol !== 'admin') {
    return null;
  }

  if (!usuario) {
    return (
      <>
        <NavegacionAdmin />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Usuario no encontrado</p>
        </div>
      </>
    );
  }

  const totalGastado = ordenes.reduce((sum, orden) => sum + orden.total, 0);

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Link href="/admin/usuarios">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" /> Volver a Usuarios
            </Button>
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">
                {usuario.nombre} {usuario.apellido}
              </h1>
              <Badge variant={usuario.rol === 'admin' ? 'default' : 'secondary'}>
                {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
              </Badge>
            </div>
            <p className="text-muted-foreground">{usuario.email}</p>
          </div>

          {/* Información del usuario */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                    <p>{usuario.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                    <p>{usuario.direccion}</p>
                    <p>
                      {usuario.ciudad}, {usuario.region}
                    </p>
                    <p>CP: {usuario.codigoPostal}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Fecha de Registro
                    </p>
                    <p>
                      {new Date(usuario.fechaCreacion).toLocaleDateString('es-CL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Gastado
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatearPrecio(totalGastado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total de Pedidos
                    </p>
                    <p className="text-xl font-semibold">{ordenes.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historial de pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              {ordenes.length > 0 ? (
                <div className="space-y-4">
                  {ordenes.map((orden) => (
                    <div
                      key={orden.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">Orden #{orden.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(orden.fechaCreacion).toLocaleDateString('es-CL')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatearPrecio(orden.total)}
                          </p>
                          <Link href={`/admin/ordenes/${orden.id}`}>
                            <Button variant="link" size="sm" className="h-auto p-0">
                              Ver detalle →
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {orden.items.slice(0, 3).map((item) => {
                          const producto = productosMap[item.productoId];
                          if (!producto) return null;
                          return (
                            <div
                              key={item.productoId}
                              className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0"
                            >
                              <Image
                                src={producto.imagen || "/placeholder.svg"}
                                alt={producto.nombre}
                                fill
                                className="object-cover"
                              />
                            </div>
                          );
                        })}
                        {orden.items.length > 3 && (
                          <div className="h-12 w-12 rounded bg-muted flex items-center justify-center text-xs font-semibold">
                            +{orden.items.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Este usuario no ha realizado pedidos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
