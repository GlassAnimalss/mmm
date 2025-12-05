"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Producto } from "@/lib/tipos"
import { formatearPrecio, calcularDescuento } from "@/lib/utilidades"

interface TarjetaProductoProps {
  producto: Producto
  onAgregar: (producto: Producto) => void
}

export default function TarjetaProducto({ producto, onAgregar }: TarjetaProductoProps) {
  return (
    <div className="flex flex-col h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <Link href={`/productos/${producto.id}`} className="flex-1">
          <div className="relative h-48">
            <Image src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} fill className="object-cover" />
            {producto.enOferta && producto.precioOferta && (
              <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-semibold">
                {calcularDescuento(producto.precio, producto.precioOferta)}% OFF
              </div>
            )}
            {producto.stock < 10 && producto.stock > 0 && (
              <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs font-semibold">
                ¡Últimas unidades!
              </div>
            )}
          </div>
          <CardContent className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-grow">{producto.descripcion}</p>
            <div className="flex items-center justify-between mb-3">
              <div>
                {producto.enOferta && producto.precioOferta ? (
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary">{formatearPrecio(producto.precioOferta)}</span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatearPrecio(producto.precio)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                )}
                <span className="text-xs text-muted-foreground"> / {producto.unidad}</span>
              </div>
            </div>
          </CardContent>
        </Link>
        <div className="px-4 pb-4">
          <Button
            onClick={() => onAgregar(producto)}
            disabled={producto.stock === 0}
            variant={producto.stock === 0 ? "secondary" : "default"}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {producto.stock === 0 ? "Sin Stock" : "Agregar"}
          </Button>
        </div>
      </Card>
    </div>
  )
}
