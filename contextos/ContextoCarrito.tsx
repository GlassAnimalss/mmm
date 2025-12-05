"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import type { ItemCarrito, Producto } from "@/lib/tipos"
import {
  obtenerCarrito,
  guardarCarrito,
  limpiarCarrito as limpiarCarritoStorage,
  obtenerProductos,
} from "@/lib/datos-locales"
import { useAuth } from "./ContextoAuth"

interface ContextoCarritoType {
  items: ItemCarrito[]
  total: number
  agregarItem: (producto: Producto, cantidad: number) => void
  eliminarItem: (productoId: string) => void
  actualizarCantidad: (productoId: string, cantidad: number) => void
  limpiarCarrito: () => void

}

const ContextoCarrito = createContext<ContextoCarritoType | undefined>(undefined)

export function ProveedorCarrito({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [total, setTotal] = useState(0)
  const { usuario } = useAuth()
  const usuarioIdAnterior = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const usuarioIdActual = usuario?.id || null

    // Evitar cargar en el primer render antes de inicialización
    if (usuarioIdAnterior.current === undefined) {
      usuarioIdAnterior.current = usuarioIdActual
      const carritoGuardado = obtenerCarrito(usuarioIdActual)
      setItems(carritoGuardado.items || [])
      return
    }

    // Si el usuario cambió, cargar su carrito específico
    if (usuarioIdAnterior.current !== usuarioIdActual) {
      usuarioIdAnterior.current = usuarioIdActual
      const carritoGuardado = obtenerCarrito(usuarioIdActual)
      setItems(carritoGuardado.items || [])
    }
  }, [usuario])

  useEffect(() => {
    const nuevoTotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
    setTotal(nuevoTotal)
    const usuarioIdActual = usuario?.id || null
    guardarCarrito({ items, total: nuevoTotal }, usuarioIdActual)
  }, [items, usuario])

  const agregarItem = (producto: Producto, cantidad: number) => {
    const itemExistente = items.find((i) => i.productoId === producto.id)

    if (itemExistente) {
      setItems(items.map((i) => (i.productoId === producto.id ? { ...i, cantidad: i.cantidad + cantidad } : i)))
    } else {
      const precio = producto.precioOferta || producto.precio
      setItems([...items, { productoId: producto.id, cantidad, precio }])
    }
  }

  const eliminarItem = (productoId: string) => {
    setItems(items.filter((i) => i.productoId !== productoId))
  }

  const actualizarCantidad = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarItem(productoId)
    } else {
      setItems(items.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i)))
    }
  }

  const limpiarCarrito = () => {
    setItems([])
    const usuarioIdActual = usuario?.id || null
    limpiarCarritoStorage(usuarioIdActual)
  }



  return (
    <ContextoCarrito.Provider
      value={{
        items,
        total,
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        limpiarCarrito,
        limpiarCarrito,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  )
}

export function useCarrito() {
  const context = useContext(ContextoCarrito)
  if (context === undefined) {
    throw new Error("useCarrito debe usarse dentro de un ProveedorCarrito")
  }
  return context
}
