import { formatearPrecio, calcularDescuento, generarId } from "@/lib/utilidades"

describe("Prueba Unitaria 1: Funciones de Formato", () => {
  describe("formatearPrecio", () => {
    it("debe formatear precios correctamente", () => {
      expect(formatearPrecio(1000)).toBe("$1.000")
      expect(formatearPrecio(10000)).toBe("$10.000")
      expect(formatearPrecio(999)).toBe("$999")
    })

    it("debe manejar cero", () => {
      expect(formatearPrecio(0)).toBe("$0")
    })

    it("debe manejar números negativos", () => {
      expect(formatearPrecio(-500)).toBe("$-500")
    })
  })

  describe("calcularDescuento", () => {
    it("debe calcular descuentos correctamente", () => {
      expect(calcularDescuento(1000, 800)).toBe(20)
      expect(calcularDescuento(2000, 1000)).toBe(50)
    })

    it("debe retornar 0 si no hay descuento", () => {
      expect(calcularDescuento(1000, 1000)).toBe(0)
      expect(calcularDescuento(1000, 1200)).toBe(-20)
    })

    it("debe redondear a enteros", () => {
      expect(calcularDescuento(1000, 667)).toBe(33)
    })
  })

  describe("generarId", () => {
    it("debe generar IDs únicos", () => {
      const id1 = generarId()
      const id2 = generarId()
      expect(id1).not.toBe(id2)
    })

    it("debe generar IDs con formato correcto", () => {
      const id = generarId()
      expect(id).toMatch(/^[a-z0-9]+$/)
      expect(id.length).toBeGreaterThan(10)
    })
  })
})
