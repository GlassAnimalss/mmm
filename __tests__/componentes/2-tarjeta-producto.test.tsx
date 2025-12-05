import { render, screen, fireEvent } from "@testing-library/react"
import TarjetaProducto from "@/componentes/TarjetaProducto"
import type { Producto } from "@/lib/tipos"
import { jest } from "@jest/globals"

describe("Prueba de Componente 2: Tarjeta de Producto", () => {
  const productoMock: Producto = {
    id: "1",
    nombre: "Manzana Roja",
    precio: 1000,
    descripcion: "Manzanas frescas y dulces",
    categoria: "frutas",
    imagen: "/test.jpg",
    stock: 10,
    unidad: "kg",
    activo: true,
    destacado: false,
    enOferta: false,
  }

  it("debe renderizar la información del producto", () => {
    render(<TarjetaProducto producto={productoMock} onAgregar={jest.fn()} />)

    expect(screen.getByText("Manzana Roja")).toBeInTheDocument()
    expect(screen.getByText("Manzanas frescas y dulces")).toBeInTheDocument()
    expect(screen.getByText(/1\.000/)).toBeInTheDocument()
  })

  it("debe mostrar badge de oferta cuando hay precio rebajado", () => {
    const productoOferta = { ...productoMock, enOferta: true, precioOferta: 800 }
    render(<TarjetaProducto producto={productoOferta} onAgregar={jest.fn()} />)

    expect(screen.getByText(/OFF/i)).toBeInTheDocument()
    expect(screen.getByText(/800/)).toBeInTheDocument()
  })

  it("debe mostrar información de stock", () => {
    const productoPocoStock = { ...productoMock, stock: 5 }
    render(<TarjetaProducto producto={productoPocoStock} onAgregar={jest.fn()} />)

    expect(screen.getByText(/Últimas unidades/i)).toBeInTheDocument()
  })

  it("debe ejecutar callback al hacer clic en agregar al carrito", () => {
    const onAgregarMock = jest.fn()
    render(<TarjetaProducto producto={productoMock} onAgregar={onAgregarMock} />)

    const botonAgregar = screen.getByText(/Agregar/i)
    fireEvent.click(botonAgregar)

    expect(onAgregarMock).toHaveBeenCalledWith(productoMock)
  })

  it("debe mostrar precio tachado cuando hay oferta", () => {
    const productoOferta = { ...productoMock, enOferta: true, precioOferta: 700 }
    render(<TarjetaProducto producto={productoOferta} onAgregar={jest.fn()} />)

    const precioOriginal = screen.getByText(/1\.000/)
    expect(precioOriginal.className).toContain("line-through")
  })

  it("debe deshabilitar botón si no hay stock", () => {
    const productoSinStock = { ...productoMock, stock: 0 }
    render(<TarjetaProducto producto={productoSinStock} onAgregar={jest.fn()} />)

    const botonAgregar = screen.getByText(/Sin Stock/i)
    expect(botonAgregar).toBeDisabled()
  })
})
