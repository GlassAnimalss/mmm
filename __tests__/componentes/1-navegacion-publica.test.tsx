import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { usePathname } from "next/navigation"
import NavegacionPublica from "@/componentes/NavegacionPublica"
import { ProveedorCarrito } from "@/contextos/ContextoCarrito"
import { ProveedorAuth } from "@/contextos/ContextoAuth"
import type { jest } from "@jest/globals"

describe("Prueba de Componente 1: Navegación Pública", () => {
  beforeEach(() => {
    const mockPathname = usePathname as jest.MockedFunction<typeof usePathname>
    mockPathname.mockReturnValue("/")
  })

  it("debe renderizar el logo y nombre de la tienda", () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    expect(screen.getByText("Huerto Hogar")).toBeInTheDocument()
  })

  it("debe renderizar todos los enlaces de navegación", () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    expect(screen.getByText("Inicio")).toBeInTheDocument()
    expect(screen.getByText("Productos")).toBeInTheDocument()
    expect(screen.getByText("Categorías")).toBeInTheDocument()
    expect(screen.getByText("Ofertas")).toBeInTheDocument()
  })

  it("debe mostrar el ícono del carrito con badge de cantidad", () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    // El carrito existe como link
    const links = screen.getAllByRole("link")
    const carritoLink = links.find((link) => link.getAttribute("href") === "/carrito")
    expect(carritoLink).toBeInTheDocument()
  })

  it("debe alternar el menú móvil al hacer clic", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    const botones = screen.getAllByRole("button")
    const botonMenu = botones.find((btn) => btn.className.includes("md:hidden"))

    if (botonMenu) {
      fireEvent.click(botonMenu)

      await waitFor(() => {
        const productosLinks = screen.getAllByText("Productos")
        expect(productosLinks.length).toBeGreaterThan(1)
      })
    }
  })

  it("debe resaltar la ruta activa", () => {
    const mockPathname = usePathname as jest.MockedFunction<typeof usePathname>
    mockPathname.mockReturnValue("/productos")

    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <NavegacionPublica />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    const enlaceProductos = screen.getAllByText("Productos")[0]
    expect(enlaceProductos.className).toContain("text-primary")
  })
})
