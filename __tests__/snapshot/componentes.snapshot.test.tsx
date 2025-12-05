import { render } from "@testing-library/react"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import PiePagina from "@/componentes/PiePagina"
import TarjetaProducto from "@/componentes/TarjetaProducto"
import { ProveedorCarrito } from "@/contextos/ContextoCarrito"
import { ProveedorAuth } from "@/contextos/ContextoAuth"
import type { Producto } from "@/lib/tipos"

describe("Prueba de Snapshot: Componentes UI", () => {
  const productoMock: Producto = {
    id: "1",
    nombre: "Manzana Roja",
    precio: 1000,
    descripcion: "Manzanas frescas",
    categoria: "frutas",
    imagen: "/manzana.jpg",
    stock: 10,
    unidad: "kg",
    activo: true,
    destacado: false,
    enOferta: false,
  }

  it("debe coincidir con snapshot de NavegacionPublica", () => {
    const { container } = render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it("debe coincidir con snapshot de PiePagina", () => {
    const { container } = render(<PiePagina />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("debe coincidir con snapshot de TarjetaProducto normal", () => {
    const { container } = render(<TarjetaProducto producto={productoMock} onAgregar={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("debe coincidir con snapshot de TarjetaProducto en oferta", () => {
    const productoOferta = { ...productoMock, enOferta: true, precioOferta: 800 }
    const { container } = render(<TarjetaProducto producto={productoOferta} onAgregar={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it("debe coincidir con snapshot de TarjetaProducto sin stock", () => {
    const productoSinStock = { ...productoMock, stock: 0 }
    const { container } = render(<TarjetaProducto producto={productoSinStock} onAgregar={() => {}} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
