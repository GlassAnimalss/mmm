import { obtenerProductos, guardarProductos, obtenerCarrito, guardarCarrito, limpiarCarrito } from "@/lib/datos-locales"

describe("Prueba Unitaria 3: Gestión de LocalStorage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe("Productos", () => {
    it("debe retornar array vacío si no hay productos", () => {
      const productos = obtenerProductos()
      expect(Array.isArray(productos)).toBe(true)
      expect(productos.length).toBe(0)
    })

    it("debe guardar y recuperar productos correctamente", () => {
      const productosTest = [
        {
          id: "1",
          nombre: "Manzana",
          precio: 1000,
          categoria: "Frutas",
          imagen: "/manzana.jpg",
          descripcion: "Manzana roja fresca",
          stock: 10,
          unidad: "kg",
          destacado: false,
          enOferta: false,
          activo: true,
        },
      ]

      guardarProductos(productosTest)
      const recuperados = obtenerProductos()

      expect(recuperados).toEqual(productosTest)
      expect(recuperados[0].nombre).toBe("Manzana")
    })
  })

  describe("Carrito", () => {
    it("debe retornar objeto con items vacío si no hay carrito", () => {
      const carrito = obtenerCarrito()
      expect(carrito).toHaveProperty("items")
      expect(carrito).toHaveProperty("total")
      expect(Array.isArray(carrito.items)).toBe(true)
      expect(carrito.items.length).toBe(0)
    })

    it("debe guardar items en el carrito", () => {
      const carritoTest = {
        items: [{ productoId: "1", cantidad: 2, precio: 500 }],
        total: 1000,
      }

      guardarCarrito(carritoTest)
      const recuperado = obtenerCarrito()

      expect(recuperado.items).toEqual(carritoTest.items)
      expect(recuperado.items[0].cantidad).toBe(2)
    })

    it("debe limpiar el carrito completamente", () => {
      guardarCarrito({
        items: [{ productoId: "1", cantidad: 1, precio: 100 }],
        total: 100,
      })

      limpiarCarrito()
      const carrito = obtenerCarrito()

      expect(carrito.items.length).toBe(0)
      expect(carrito.total).toBe(0)
    })
  })
})
