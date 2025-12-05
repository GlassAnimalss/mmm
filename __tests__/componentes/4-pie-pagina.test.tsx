import { render, screen } from "@testing-library/react"
import PiePagina from "@/componentes/PiePagina"

describe("Prueba de Componente 4: Pie de Página", () => {
  it("debe renderizar el nombre de la empresa", () => {
    render(<PiePagina />)
    const elementos = screen.getAllByText(/huerto hogar/i)
    expect(elementos.length).toBeGreaterThan(0)
  })

  it("debe renderizar las secciones principales", () => {
    render(<PiePagina />)

    expect(screen.getByText(/enlaces rápidos/i)).toBeInTheDocument()
    expect(screen.getByText(/información/i)).toBeInTheDocument()
    const contactoElements = screen.getAllByText(/contacto/i)
    expect(contactoElements.length).toBeGreaterThan(0)
  })

  it("debe mostrar enlaces de navegación", () => {
    render(<PiePagina />)

    expect(screen.getAllByText("Productos")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Categorías")[0]).toBeInTheDocument()
    expect(screen.getByText("Ofertas")).toBeInTheDocument()
  })

  it("debe mostrar información de contacto", () => {
    render(<PiePagina />)

    expect(screen.getByText(/contacto@huertohogar.cl/i)).toBeInTheDocument()
    expect(screen.getByText(/\+56 9 1234 5678/i)).toBeInTheDocument()
  })

  it("debe mostrar iconos de redes sociales", () => {
    render(<PiePagina />)

    expect(screen.getByLabelText("Facebook")).toBeInTheDocument()
    expect(screen.getByLabelText("Instagram")).toBeInTheDocument()
    expect(screen.getByLabelText(/Twitter/i)).toBeInTheDocument()
  })

  it("debe mostrar el año actual en copyright", () => {
    render(<PiePagina />)
    expect(screen.getByText(/2025/)).toBeInTheDocument()
  })
})
