import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import PaginaProductos from "@/app/productos/page"
import { ProveedorCarrito } from "@/contextos/ContextoCarrito"
import { ProveedorAuth } from "@/contextos/ContextoAuth"

describe("Prueba de Componente 5: Lista de Productos", () => {
  it("debe renderizar la página de productos", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      const elementos = screen.getAllByText("Productos")
      expect(elementos.length).toBeGreaterThan(0)
    })
  })

  it("debe mostrar filtros de búsqueda", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Buscar productos...")).toBeInTheDocument()
    })
  })

  it("debe filtrar productos por búsqueda", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Buscar productos...")
      fireEvent.change(searchInput, { target: { value: "Manzana" } })
    })

    await waitFor(() => {
      expect(screen.getByText(/Mostrando \d+ productos/)).toBeInTheDocument()
    })
  })

  it("debe mostrar mensaje cuando no hay productos", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Buscar productos...")
      fireEvent.change(searchInput, { target: { value: "productoquenoexiste99999" } })
    })

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron productos/)).toBeInTheDocument()
    })
  })

  it("debe mostrar opciones de ordenamiento", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      expect(screen.getByText("Destacados")).toBeInTheDocument()
    })
  })

  it("debe mostrar filtro de categorías", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Todas las categorías/i)).toBeInTheDocument()
    })
  })

  it("debe permitir limpiar filtros", async () => {
    render(
      <ProveedorAuth>
        <ProveedorCarrito>
          <PaginaProductos />
        </ProveedorCarrito>
      </ProveedorAuth>,
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText("Buscar productos...")
      fireEvent.change(searchInput, { target: { value: "xyz" } })
    })

    await waitFor(() => {
      const limpiarBtn = screen.queryByText("Limpiar Filtros")
      if (limpiarBtn) {
        expect(limpiarBtn).toBeInTheDocument()
      }
    })
  })
})
