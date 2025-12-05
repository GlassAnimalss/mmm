import { renderHook, act } from "@testing-library/react"
import { ProveedorCarrito, useCarrito } from "@/contextos/ContextoCarrito"
import type { Producto } from "@/lib/tipos"

describe("Prueba de Componente 3: Contexto del Carrito", () => {
  const productoTest: Producto = {
    id: "1",
    nombre: "Tomate",
    precio: 800,
    descripcion: "Tomates frescos",
    categoria: "Verduras",
    imagen: "/tomate.jpg",
    stock: 20,
    unidad: "kg",
    activo: true,
    destacado: false,
    enOferta: false,
  }

  beforeEach(() => {
    localStorage.clear()
  })

  it("debe inicializar con carrito vacío", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    expect(result.current.items).toEqual([])
    expect(result.current.items.length).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it("debe agregar producto al carrito", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 2)
    })

    expect(result.current.items.length).toBe(1)
    expect(result.current.items[0].cantidad).toBe(2)
  })

  it("debe incrementar cantidad si producto ya existe", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 1)
    })

    act(() => {
      result.current.agregarItem(productoTest, 2)
    })

    expect(result.current.items.length).toBe(1)
    expect(result.current.items[0].cantidad).toBe(3)
  })

  it("debe eliminar producto del carrito", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 1)
      result.current.eliminarItem("1")
    })

    expect(result.current.items.length).toBe(0)
  })

  it("debe actualizar cantidad de producto", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 2)
    })

    act(() => {
      result.current.actualizarCantidad("1", 5)
    })

    expect(result.current.items[0].cantidad).toBe(5)
  })

  it("debe calcular el total correctamente", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 3)
    })

    expect(result.current.total).toBe(2400) // 800 * 3
  })

  it("debe usar precio de oferta si está disponible", () => {
    const productoOferta = { ...productoTest, precioOferta: 600, enOferta: true }
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoOferta, 2)
    })

    expect(result.current.total).toBe(1200) // 600 * 2
  })

  it("debe limpiar el carrito completamente", () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: ProveedorCarrito,
    })

    act(() => {
      result.current.agregarItem(productoTest, 5)
      result.current.limpiarCarrito()
    })

    expect(result.current.items.length).toBe(0)
    expect(result.current.total).toBe(0)
  })
})
