describe("Prueba Unitaria 4: Lógica de Negocio del Carrito", () => {
  // Función pura para calcular total
  const calcularTotal = (items: Array<{ precio: number; cantidad: number }>) => {
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  // Función pura para aplicar descuento
  const aplicarDescuento = (total: number, porcentaje: number) => {
    return total - (total * porcentaje) / 100
  }

  // Función pura para agregar item
  const agregarItem = (
    carrito: Array<{ id: string; cantidad: number }>,
    nuevoItem: { id: string; cantidad: number },
  ) => {
    const itemExistente = carrito.find((item) => item.id === nuevoItem.id)

    if (itemExistente) {
      return carrito.map((item) =>
        item.id === nuevoItem.id ? { ...item, cantidad: item.cantidad + nuevoItem.cantidad } : item,
      )
    }

    return [...carrito, nuevoItem]
  }

  describe("Cálculo de totales", () => {
    it("debe calcular el total correctamente", () => {
      const items = [
        { precio: 1000, cantidad: 2 },
        { precio: 500, cantidad: 3 },
      ]
      expect(calcularTotal(items)).toBe(3500)
    })

    it("debe retornar 0 para carrito vacío", () => {
      expect(calcularTotal([])).toBe(0)
    })
  })

  describe("Aplicación de descuentos", () => {
    it("debe aplicar descuento correctamente", () => {
      expect(aplicarDescuento(1000, 10)).toBe(900)
      expect(aplicarDescuento(2000, 25)).toBe(1500)
    })

    it("debe manejar 0% de descuento", () => {
      expect(aplicarDescuento(1000, 0)).toBe(1000)
    })
  })

  describe("Agregar items", () => {
    it("debe agregar nuevo item al carrito", () => {
      const carrito = [{ id: "1", cantidad: 2 }]
      const resultado = agregarItem(carrito, { id: "2", cantidad: 1 })

      expect(resultado.length).toBe(2)
      expect(resultado[1].id).toBe("2")
    })

    it("debe incrementar cantidad si item ya existe", () => {
      const carrito = [{ id: "1", cantidad: 2 }]
      const resultado = agregarItem(carrito, { id: "1", cantidad: 3 })

      expect(resultado.length).toBe(1)
      expect(resultado[0].cantidad).toBe(5)
    })
  })
})
