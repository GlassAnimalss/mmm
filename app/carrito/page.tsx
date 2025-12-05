'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NavegacionPublica from '@/componentes/NavegacionPublica';
import PiePagina from '@/componentes/PiePagina';
import { useCarrito } from '@/contextos/ContextoCarrito';
import { Producto } from '@/lib/tipos';
import { formatearPrecio } from '@/lib/utilidades';

import { obtenerProductosPorIds } from "@/lib/api/productos";

export default function PaginaCarrito() {
  const { items, total, actualizarCantidad, eliminarItem } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const costoEnvio = 2990;

  useEffect(() => {
    if (items.length > 0) {
      const cargarProductos = async () => {
        const ids = items.map((item) => item.productoId);
        const prods = await obtenerProductosPorIds(ids);
        setProductos(prods);
      };
      cargarProductos();
    }
  }, [items]);

  if (items.length === 0) {
    return (
      <>
        <NavegacionPublica />
        <main className="min-h-screen py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-muted-foreground mb-8">
              Agrega productos a tu carrito para continuar
            </p>
            <Link href="/productos">
              <Button size="lg" className="gap-2">
                Explorar Productos <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>
        <PiePagina />
      </>
    );
  }

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Carrito de Compras</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items del carrito */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const producto = productos.find((p) => p.id === item.productoId);
                if (!producto) return null;

                return (
                  <Card key={item.productoId}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            src={producto.imagen || "/placeholder.svg"}
                            alt={producto.nombre}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link href={`/productos/${producto.id}`}>
                                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                  {producto.nombre}
                                </h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                {formatearPrecio(item.precio)} / {producto.unidad}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => eliminarItem(item.productoId)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  actualizarCantidad(item.productoId, item.cantidad - 1)
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.cantidad}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  actualizarCantidad(item.productoId, item.cantidad + 1)
                                }
                                disabled={item.cantidad >= producto.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                              {formatearPrecio(item.precio * item.cantidad)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Resumen del Pedido
                  </h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{formatearPrecio(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="font-semibold">{formatearPrecio(costoEnvio)}</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatearPrecio(total + costoEnvio)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button size="lg" className="w-full gap-2">
                      Proceder al Pago <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/productos">
                    <Button variant="outline" size="lg" className="w-full mt-3">
                      Seguir Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
