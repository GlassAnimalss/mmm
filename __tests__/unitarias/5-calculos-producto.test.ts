describe("Prueba Unitaria 5: Cálculos de Productos", () => {
  // Función para calcular precio final con oferta
  const calcularPrecioFinal = (precioOriginal: number, precioOferta?: number) => {
    return precioOferta && precioOferta < precioOriginal ? precioOferta : precioOriginal
  }

  // Función para calcular ahorro
  const calcularAhorro = (precioOriginal: number, precioOferta?: number) => {
    if (!precioOferta || precioOferta >= precioOriginal) return 0
    return precioOriginal - precioOferta
  }

  // Función para verificar disponibilidad
  const verificarDisponibilidad = (stock: number, cantidadSolicitada: number) => {
    return stock >= cantidadSolicitada
  }

  // Función para calcular subtotal
  const calcularSubtotal = (precio: number, cantidad: number) => {
    return precio * cantidad
  }

  describe("Precio final", () => {
    it("debe usar precio de oferta si es menor", () => {
      expect(calcularPrecioFinal(1000, 800)).toBe(800)
      expect(calcularPrecioFinal(2000, 1500)).toBe(1500)
    })

    it("debe usar precio original si no hay oferta", () => {
      expect(calcularPrecioFinal(1000)).toBe(1000)
      expect(calcularPrecioFinal(1000, undefined)).toBe(1000)
    })

    it("debe usar precio original si oferta es mayor o igual", () => {
      expect(calcularPrecioFinal(1000, 1200)).toBe(1000)
      expect(calcularPrecioFinal(1000, 1000)).toBe(1000)
    })
  })

  describe("Cálculo de ahorro", () => {
    it("debe calcular ahorro correctamente", () => {
      expect(calcularAhorro(1000, 800)).toBe(200)
      expect(calcularAhorro(2000, 1500)).toBe(500)
    })

    it("debe retornar 0 si no hay ahorro", () => {
      expect(calcularAhorro(1000)).toBe(0)
      expect(calcularAhorro(1000, 1000)).toBe(0)
      expect(calcularAhorro(1000, 1200)).toBe(0)
    })
  })

  describe("Disponibilidad de stock", () => {
    it("debe verificar stock disponible", () => {
      expect(verificarDisponibilidad(10, 5)).toBe(true)
      expect(verificarDisponibilidad(5, 5)).toBe(true)
    })

    it("debe detectar stock insuficiente", () => {
      expect(verificarDisponibilidad(3, 5)).toBe(false)
      expect(verificarDisponibilidad(0, 1)).toBe(false)
    })
  })

  describe("Cálculo de subtotal", () => {
    it("debe calcular subtotal correctamente", () => {
      expect(calcularSubtotal(1000, 2)).toBe(2000)
      expect(calcularSubtotal(500, 5)).toBe(2500)
    })

    it("debe manejar cantidad 0", () => {
      expect(calcularSubtotal(1000, 0)).toBe(0)
    })
  })
})
