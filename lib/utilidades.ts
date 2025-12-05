export function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-CL")}`
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validarPassword(password: string): boolean {
  return password.length >= 6
}

export function generarId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export function validarTelefonoChileno(telefono: string): boolean {
  // Eliminar espacios y guiones
  const telefonoLimpio = telefono.replace(/[\s-]/g, "")

  // Formato chileno: +56912345678 (con código de país) o 912345678 (sin código)
  // Los números móviles en Chile comienzan con 9 y tienen 9 dígitos en total
  const formatoConCodigo = /^\+569\d{8}$/
  const formatoSinCodigo = /^9\d{8}$/

  return formatoConCodigo.test(telefonoLimpio) || formatoSinCodigo.test(telefonoLimpio)
}

export const validarTelefono = validarTelefonoChileno

export function formatearTelefonoChileno(telefono: string): string {
  // Eliminar todo excepto números
  const numeros = telefono.replace(/\D/g, "")

  // Si empieza con 56, asumimos que tiene código de país
  if (numeros.startsWith("56") && numeros.length === 11) {
    return `+56 ${numeros.slice(2, 3)} ${numeros.slice(3, 7)} ${numeros.slice(7)}`
  }

  // Si tiene 9 dígitos, es formato local
  if (numeros.length === 9 && numeros.startsWith("9")) {
    return `+56 ${numeros.slice(0, 1)} ${numeros.slice(1, 5)} ${numeros.slice(5)}`
  }

  return telefono
}

export function calcularDescuento(precio: number, precioOferta: number): number {
  return Math.round(((precio - precioOferta) / precio) * 100)
}

export const regionesChile = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana de Santiago",
  "Libertador General Bernardo O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén del General Carlos Ibáñez del Campo",
  "Magallanes y de la Antártica Chilena",
]
