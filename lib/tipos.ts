export interface Usuario {
  id: string
  email: string
  nombre: string
  apellido: string
  telefono?: string
  direccion?: string
  ciudad?: string
  region?: string
  codigoPostal?: string
  rol: "cliente" | "admin"
  fechaRegistro?: string
}

export interface Categoria {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  activa: boolean
}

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  precio: number
  precioOferta?: number
  stock: number
  categoria: string
  imagen: string
  unidad: string
  destacado: boolean
  enOferta: boolean
  activo: boolean
}

export interface ItemCarrito {
  productoId: string
  cantidad: number
  precio: number
}

export interface ItemOrden {
  productoId: string
  cantidad: number
  precio: number
  // Snapshot del producto al momento de la compra
  nombreProducto: string
  imagenProducto: string
  unidadProducto: string
}

export interface Carrito {
  items: ItemCarrito[]
  total: number
}

export interface Orden {
  id: string
  usuarioId: string
  items: ItemOrden[]
  subtotal: number
  envio: number
  total: number
  estado: "pendiente" | "procesando" | "enviado" | "entregado" | "cancelado"
  metodoPago: string
  direccionEnvio: {
    nombre: string
    apellido: string
    direccion: string
    ciudad: string
    region: string
    codigoPostal: string
    telefono: string
  }
  fechaCreacion: string
  fechaActualizacion: string
  notas?: string
}

export interface EstadoAuth {
  usuario: Usuario | null
  autenticado: boolean
}

export interface Comentario {
  id: string
  articuloId: string
  nombre: string
  comentario: string
  fechaCreacion: string
}

export interface Articulo {
  id: string
  titulo: string
  extracto: string
  imagen: string
  fecha: string
  autor: string
  contenido: string[]
  activo: boolean
}

export interface JwtPayload {
  id: string
  email: string
  rol: "cliente" | "admin"
  iat: number // Issued at
  exp: number // Expiration time
}
