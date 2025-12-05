import { validarEmail, validarPassword, validarTelefonoChileno } from "@/lib/utilidades"

describe("Prueba Unitaria 2: Funciones de Validación", () => {
  describe("validarEmail", () => {
    it("debe validar emails correctos", () => {
      expect(validarEmail("usuario@ejemplo.com")).toBe(true)
      expect(validarEmail("test@dominio.cl")).toBe(true)
      expect(validarEmail("nombre.apellido@empresa.com")).toBe(true)
    })

    it("debe rechazar emails inválidos", () => {
      expect(validarEmail("invalido")).toBe(false)
      expect(validarEmail("sin@dominio")).toBe(false)
      expect(validarEmail("@sinusuario.com")).toBe(false)
      expect(validarEmail("usuario@")).toBe(false)
    })

    it("debe manejar strings vacíos", () => {
      expect(validarEmail("")).toBe(false)
    })
  })

  describe("validarPassword", () => {
    it("debe aceptar contraseñas válidas (mínimo 6 caracteres)", () => {
      expect(validarPassword("123456")).toBe(true)
      expect(validarPassword("password123")).toBe(true)
      expect(validarPassword("MiPass!")).toBe(true)
    })

    it("debe rechazar contraseñas cortas", () => {
      expect(validarPassword("12345")).toBe(false)
      expect(validarPassword("abc")).toBe(false)
      expect(validarPassword("")).toBe(false)
    })
  })

  describe("validarTelefonoChileno", () => {
    it("debe validar teléfonos chilenos correctos", () => {
      expect(validarTelefonoChileno("912345678")).toBe(true)
      expect(validarTelefonoChileno("+56912345678")).toBe(true)
      expect(validarTelefonoChileno("56912345678")).toBe(false)
    })

    it("debe rechazar teléfonos inválidos", () => {
      expect(validarTelefonoChileno("12345")).toBe(false)
      expect(validarTelefonoChileno("abcdefghi")).toBe(false)
      expect(validarTelefonoChileno("")).toBe(false)
    })
  })
})
