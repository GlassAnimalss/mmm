import type { Usuario, Categoria, Producto, Orden, ItemCarrito, Articulo, Comentario } from "./tipos"

const STORAGE_KEYS = {
  USUARIOS: "huertohogar_usuarios",
  CATEGORIAS: "huertohogar_categorias",
  PRODUCTOS: "huertohogar_productos",
  ORDENES: "huertohogar_ordenes",
  USUARIO_ACTUAL: "huertohogar_usuario_actual",
  CARRITO: "huertohogar_carrito",
  ARTICULOS: "huertohogar_articulos",
  COMENTARIOS: "huertohogar_comentarios",
}

// Inicializar datos por defecto
export function inicializarDatos() {
  if (typeof window === "undefined") return

  const usuariosExistentes = localStorage.getItem(STORAGE_KEYS.USUARIOS)
  if (usuariosExistentes) {
    const usuarios: Usuario[] = JSON.parse(usuariosExistentes)
    const adminAntiguo = usuarios.find((u) => u.email === "adminhuertohogar.cl")
    if (adminAntiguo) {
      adminAntiguo.email = "admin@huertohogar.cl"
      localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
    }
  }

  // Usuarios por defecto
  if (!localStorage.getItem(STORAGE_KEYS.USUARIOS)) {
    const usuarios: Usuario[] = [
      {
        id: "1",
        email: "cliente@gmail.cl",
        nombre: "Cliente",
        apellido: "Demo",
        telefono: "+56912345678",
        direccion: "Av. Libertador Bernardo O'Higgins 1234",
        ciudad: "Santiago",
        region: "Metropolitana",
        codigoPostal: "8320000",
        rol: "cliente",
        fechaCreacion: new Date().toISOString(),
      },
      {
        id: "2",
        email: "admin@huertohogar.cl",
        nombre: "Admin",
        apellido: "Huerto Hogar",
        telefono: "+56987654321",
        direccion: "Calle Admin 100",
        ciudad: "Santiago",
        region: "Metropolitana",
        codigoPostal: "8320000",
        rol: "admin",
        fechaCreacion: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
  }

  // Categorías por defecto
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIAS)) {
    const categorias: Categoria[] = [
      {
        id: "1",
        nombre: "Frutas Frescas",
        descripcion: "Frutas frescas de temporada",
        imagen: "/frutas-frescas-naturales.jpg",
        activa: true,
      },
      {
        id: "2",
        nombre: "Verduras",
        descripcion: "Verduras y hortalizas del día",
        imagen: "/verduras-frescas.jpg",
        activa: true,
      },
      {
        id: "3",
        nombre: "Frutas Exóticas",
        descripcion: "Frutas importadas y exóticas",
        imagen: "/frutas-exoticas.jpg",
        activa: true,
      },
      {
        id: "4",
        nombre: "Hierbas y Especias",
        descripcion: "Hierbas aromáticas y especias",
        imagen: "/hierbas-aromaticas.jpg",
        activa: true,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias))
  }

  // Productos por defecto
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTOS)) {
    const productos: Producto[] = [
      {
        id: "1",
        nombre: "Manzanas Rojas",
        descripcion: "Manzanas rojas frescas y crujientes",
        precio: 1990,
        stock: 50,
        categoria: "1",
        imagen: "/manzanas-rojas-frescas.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: false,
        activo: true,
      },
      {
        id: "2",
        nombre: "Tomates",
        descripcion: "Tomates frescos de invernadero",
        precio: 1590,
        precioOferta: 1290,
        stock: 80,
        categoria: "2",
        imagen: "/tomates-frescos.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: true,
        activo: true,
      },
      {
        id: "3",
        nombre: "Plátanos",
        descripcion: "Plátanos maduros ideales para consumo",
        precio: 1490,
        stock: 100,
        categoria: "1",
        imagen: "/platanos-maduros.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: false,
        activo: true,
      },
      {
        id: "4",
        nombre: "Lechugas",
        descripcion: "Lechugas verdes frescas",
        precio: 890,
        stock: 60,
        categoria: "2",
        imagen: "/lechugas-verdes.jpg",
        unidad: "unidad",
        destacado: false,
        enOferta: false,
        activo: true,
      },
      {
        id: "5",
        nombre: "Paltas",
        descripcion: "Paltas Hass premium",
        precio: 2990,
        stock: 40,
        categoria: "1",
        imagen: "/paltas-hass.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: false,
        activo: true,
      },
      {
        id: "6",
        nombre: "Zanahorias",
        descripcion: "Zanahorias frescas y dulces",
        precio: 790,
        stock: 70,
        categoria: "2",
        imagen: "/zanahorias-frescas.jpg",
        unidad: "kg",
        destacado: false,
        enOferta: false,
        activo: true,
      },
      {
        id: "7",
        nombre: "Mangos",
        descripcion: "Mangos tropicales dulces",
        precio: 3490,
        precioOferta: 2990,
        stock: 30,
        categoria: "3",
        imagen: "/mangos-tropicales.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: true,
        activo: true,
      },
      {
        id: "8",
        nombre: "Papas",
        descripcion: "Papas blancas para cocinar",
        precio: 1290,
        stock: 120,
        categoria: "2",
        imagen: "/papas-blancas.jpg",
        unidad: "kg",
        destacado: false,
        enOferta: false,
        activo: true,
      },
      {
        id: "9",
        nombre: "Albahaca",
        descripcion: "Albahaca fresca aromática",
        precio: 1490,
        stock: 5,
        categoria: "4",
        imagen: "/albahaca-fresca.jpg",
        unidad: "manojo",
        destacado: false,
        enOferta: false,
        activo: true,
      },
      {
        id: "10",
        nombre: "Fresas",
        descripcion: "Fresas frescas y dulces",
        precio: 2490,
        stock: 45,
        categoria: "1",
        imagen: "/fresas-frescas.jpg",
        unidad: "kg",
        destacado: true,
        enOferta: false,
        activo: true,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos))
  }

  // Órdenes por defecto
  if (!localStorage.getItem(STORAGE_KEYS.ORDENES)) {
    localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify([]))
  }

  if (!localStorage.getItem(STORAGE_KEYS.ARTICULOS)) {
    const articulos: Articulo[] = [
      {
        id: "1",
        titulo: "Beneficios de las Frutas de Temporada",
        extracto:
          "Descubre por qué es importante consumir frutas de temporada y cómo benefician tu salud y el medio ambiente.",
        imagen: "/frutas-frescas-naturales.jpg",
        fecha: "15 de Enero, 2025",
        autor: "Equipo Huerto Hogar",
        contenido: [
          "Las frutas de temporada son aquellas que se cosechan en su momento óptimo de maduración, cuando las condiciones climáticas son ideales para su desarrollo. Consumir frutas de temporada no solo es beneficioso para tu salud, sino también para el medio ambiente y la economía local.",
          "Uno de los principales beneficios es el sabor. Las frutas de temporada tienen un sabor más intenso y auténtico porque maduran naturalmente en la planta. Además, son más nutritivas ya que contienen mayores niveles de vitaminas, minerales y antioxidantes.",
          "Desde el punto de vista económico, las frutas de temporada suelen ser más económicas porque hay mayor disponibilidad en el mercado. Esto también reduce los costos de transporte y almacenamiento.",
          "El impacto ambiental es otro factor importante. Al consumir frutas locales de temporada, reduces la huella de carbono asociada al transporte de alimentos desde lugares lejanos. También apoyas a los agricultores locales y contribuyes a la economía de tu región.",
          "En Huerto Hogar, nos aseguramos de ofrecerte siempre las mejores frutas de temporada, frescas y de la más alta calidad. Visita nuestra tienda y descubre los sabores auténticos de cada estación.",
        ],
        activo: true,
      },
      {
        id: "2",
        titulo: "Cómo Conservar tus Verduras Frescas por Más Tiempo",
        extracto:
          "Aprende técnicas profesionales para mantener tus verduras frescas y crujientes durante más tiempo en casa.",
        imagen: "/verduras-frescas.jpg",
        fecha: "10 de Enero, 2025",
        autor: "Equipo Huerto Hogar",
        contenido: [
          "Conservar las verduras frescas puede ser todo un desafío, pero con los métodos adecuados puedes prolongar significativamente su vida útil y mantener su calidad nutricional.",
          "La temperatura es clave. La mayoría de las verduras se conservan mejor en el refrigerador, pero algunas como los tomates, cebollas y papas prefieren temperaturas ambiente. Mantén tu refrigerador entre 1-4°C para resultados óptimos.",
          "La humedad también juega un papel importante. Las verduras de hoja verde necesitan alta humedad, por eso es recomendable guardarlas en bolsas perforadas o en el cajón de verduras del refrigerador. Las zanahorias y el apio se mantienen crujientes si se guardan en agua.",
          "Evita lavar las verduras antes de guardarlas, ya que la humedad excesiva puede acelerar su deterioro. Lávalas justo antes de consumirlas. Si compras verduras ya lavadas, asegúrate de secarlas bien antes de refrigerarlas.",
          "Separa las verduras que producen etileno (como tomates y pimientos) de las que son sensibles a este gas (como lechugas y brócoli). El etileno acelera la maduración y puede hacer que algunas verduras se echen a perder más rápido.",
          "En Huerto Hogar, te ofrecemos verduras ultra frescas que durarán más tiempo en tu hogar. Sigue estos consejos y disfruta de productos de calidad por más tiempo.",
        ],
        activo: true,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.ARTICULOS, JSON.stringify(articulos))
  }

  if (!localStorage.getItem(STORAGE_KEYS.COMENTARIOS)) {
    localStorage.setItem(STORAGE_KEYS.COMENTARIOS, JSON.stringify([]))
  }
}

// Funciones de usuarios
export function obtenerUsuarios(): Usuario[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.USUARIOS)
  return data ? JSON.parse(data) : []
}

export function guardarUsuarios(usuarios: Usuario[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USUARIOS, JSON.stringify(usuarios))
}

export function obtenerUsuarioActual(): Usuario | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(STORAGE_KEYS.USUARIO_ACTUAL)
  return data ? JSON.parse(data) : null
}

export function guardarUsuarioActual(usuario: Usuario | null) {
  if (typeof window === "undefined") return
  if (usuario) {
    localStorage.setItem(STORAGE_KEYS.USUARIO_ACTUAL, JSON.stringify(usuario))
  } else {
    localStorage.removeItem(STORAGE_KEYS.USUARIO_ACTUAL)
  }
}

// Funciones de categorías
export function obtenerCategorias(): Categoria[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIAS)
  return data ? JSON.parse(data) : []
}

export function guardarCategorias(categorias: Categoria[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias))
}

// Funciones de productos
export function obtenerProductos(): Producto[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTOS)
  return data ? JSON.parse(data) : []
}

export function guardarProductos(productos: Producto[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.PRODUCTOS, JSON.stringify(productos))
}

// Funciones de órdenes
export function obtenerOrdenes(): Orden[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ORDENES)
  return data ? JSON.parse(data) : []
}

export function guardarOrdenes(ordenes: Orden[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ORDENES, JSON.stringify(ordenes))
}

// Funciones de carrito
export function obtenerCarrito(usuarioId?: string | null): { items: any[]; total: number } {
  if (typeof window === "undefined") return { items: [], total: 0 }

  // Si hay un usuario, obtener su carrito específico
  if (usuarioId) {
    const data = localStorage.getItem(`${STORAGE_KEYS.CARRITO}_${usuarioId}`)
    return data ? JSON.parse(data) : { items: [], total: 0 }
  }

  // Carrito para usuarios no autenticados (invitados)
  const data = localStorage.getItem(`${STORAGE_KEYS.CARRITO}_guest`)
  return data ? JSON.parse(data) : { items: [], total: 0 }
}

export function guardarCarrito(carrito: any, usuarioId?: string | null) {
  if (typeof window === "undefined") return

  // Guardar carrito específico por usuario
  if (usuarioId) {
    localStorage.setItem(`${STORAGE_KEYS.CARRITO}_${usuarioId}`, JSON.stringify(carrito))
  } else {
    // Carrito para invitados
    localStorage.setItem(`${STORAGE_KEYS.CARRITO}_guest`, JSON.stringify(carrito))
  }
}

export function limpiarCarrito(usuarioId?: string | null) {
  if (typeof window === "undefined") return

  if (usuarioId) {
    localStorage.removeItem(`${STORAGE_KEYS.CARRITO}_${usuarioId}`)
  } else {
    localStorage.removeItem(`${STORAGE_KEYS.CARRITO}_guest`)
  }
}

export function descontarStockProductos(items: ItemCarrito[]) {
  if (typeof window === "undefined") return

  const productos = obtenerProductos()
  let actualizado = false

  items.forEach((item) => {
    const productoIndex = productos.findIndex((p) => p.id === item.productoId)
    if (productoIndex !== -1) {
      // Restar la cantidad comprada del stock
      productos[productoIndex].stock -= item.cantidad

      // Evitar stock negativo
      if (productos[productoIndex].stock < 0) {
        productos[productoIndex].stock = 0
      }

      actualizado = true
    }
  })

  // Solo guardar si hubo cambios
  if (actualizado) {
    guardarProductos(productos)
  }
}

export function obtenerArticulos(): Articulo[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.ARTICULOS)
  return data ? JSON.parse(data) : []
}

export function guardarArticulos(articulos: Articulo[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.ARTICULOS, JSON.stringify(articulos))
}

export function obtenerComentarios(): Comentario[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEYS.COMENTARIOS)
  return data ? JSON.parse(data) : []
}

export function guardarComentarios(comentarios: Comentario[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.COMENTARIOS, JSON.stringify(comentarios))
}

export function obtenerComentariosPorArticulo(articuloId: string): Comentario[] {
  const comentarios = obtenerComentarios()
  return comentarios
    .filter((c) => c.articuloId === articuloId)
    .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
}

export function agregarComentario(articuloId: string, nombre: string, comentario: string): Comentario {
  const comentarios = obtenerComentarios()
  const nuevoComentario: Comentario = {
    id: Date.now().toString(),
    articuloId,
    nombre,
    comentario,
    fechaCreacion: new Date().toISOString(),
  }
  comentarios.push(nuevoComentario)
  guardarComentarios(comentarios)
  return nuevoComentario
}
