# Documentación de API REST - Huerto Hogar

Esta documentación describe todos los endpoints de la API REST del proyecto Huerto Hogar, que utiliza Next.js API Routes y PocketBase como backend.

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Productos](#productos)
3. [Usuarios](#usuarios)
4. [Estructura de Respuestas](#estructura-de-respuestas)

---

## Autenticación

Todos los endpoints de autenticación utilizan PocketBase para gestionar usuarios y sesiones con JWT.

### POST `/api/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
\`\`\`json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "passwordConfirm": "contraseña123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "rol": "cliente"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "abc123",
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "cliente",
      "fechaRegistro": "2024-01-15T10:30:00Z"
    }
  }
}
\`\`\`

**Response (400):**
\`\`\`json
{
  "success": false,
  "error": "El email ya está registrado"
}
\`\`\`

**Reglas de Validación:**
- Email debe ser válido
- Password mínimo 8 caracteres
- Password y passwordConfirm deben coincidir
- Nombre y apellido son obligatorios

---

### POST `/api/auth/login`

Inicia sesión en el sistema.

**Request Body:**
\`\`\`json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "abc123",
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "cliente",
      "telefono": "+56912345678",
      "direccion": "Av. Principal 123",
      "ciudad": "Santiago",
      "region": "Región Metropolitana",
      "codigoPostal": "8320000"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
\`\`\`

**Response (401):**
\`\`\`json
{
  "success": false,
  "error": "Email o contraseña incorrectos"
}
\`\`\`

**Nota:** El token JWT se almacena automáticamente en una cookie `pb_auth` con httpOnly.

---

### POST `/api/auth/logout`

Cierra la sesión del usuario actual.

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
\`\`\`

---

### GET `/api/auth/me`

Obtiene la información del usuario autenticado.

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "abc123",
      "email": "usuario@ejemplo.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "cliente",
      "telefono": "+56912345678",
      "direccion": "Av. Principal 123",
      "ciudad": "Santiago",
      "region": "Región Metropolitana",
      "codigoPostal": "8320000"
    }
  }
}
\`\`\`

**Response (401):**
\`\`\`json
{
  "success": false,
  "error": "No autenticado"
}
\`\`\`

---

### PUT `/api/auth/profile`

Actualiza el perfil del usuario autenticado.

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Request Body:**
\`\`\`json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez González",
  "telefono": "+56987654321",
  "direccion": "Nueva Dirección 456",
  "ciudad": "Valparaíso",
  "region": "Región de Valparaíso",
  "codigoPostal": "2340000"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "abc123",
      "email": "usuario@ejemplo.com",
      "nombre": "Juan Carlos",
      "apellido": "Pérez González",
      "telefono": "+56987654321",
      "direccion": "Nueva Dirección 456",
      "ciudad": "Valparaíso",
      "region": "Región de Valparaíso",
      "codigoPostal": "2340000",
      "rol": "cliente"
    }
  }
}
\`\`\`

---

## Productos

### GET `/api/productos`

Obtiene todos los productos disponibles.

**Query Parameters:**
- `categoria` (opcional): Filtrar por categoría (Verduras, Frutas, Hierbas, Semillas)
- `disponible` (opcional): true/false para filtrar productos disponibles

**Ejemplos:**
- `/api/productos` - Todos los productos
- `/api/productos?categoria=Frutas` - Solo frutas
- `/api/productos?disponible=true` - Solo productos disponibles

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "productos": [
      {
        "id": "prod123",
        "nombre": "Tomate Orgánico",
        "descripcion": "Tomates frescos cultivados sin pesticidas",
        "precio": 2500,
        "stock": 50,
        "categoria": "Verduras",
        "imagen": "/imagenes/tomate.jpg",
        "unidad": "kg",
        "destacado": true,
        "enOferta": false,
        "activo": true
      },
      {
        "id": "prod456",
        "nombre": "Manzana Fuji",
        "descripcion": "Manzanas dulces y crujientes",
        "precio": 3200,
        "precioOferta": 2800,
        "stock": 30,
        "categoria": "Frutas",
        "imagen": "/imagenes/manzana.jpg",
        "unidad": "kg",
        "destacado": true,
        "enOferta": true,
        "activo": true
      }
    ],
    "total": 2
  }
}
\`\`\`

---

### GET `/api/productos/[id]`

Obtiene un producto específico por su ID.

**URL Parameters:**
- `id` (requerido): ID del producto

**Ejemplo:** `/api/productos/prod123`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "producto": {
      "id": "prod123",
      "nombre": "Tomate Orgánico",
      "descripcion": "Tomates frescos cultivados sin pesticidas",
      "precio": 2500,
      "stock": 50,
      "categoria": "Verduras",
      "imagen": "/imagenes/tomate.jpg",
      "unidad": "kg",
      "destacado": true,
      "enOferta": false,
      "activo": true
    }
  }
}
\`\`\`

**Response (404):**
\`\`\`json
{
  "success": false,
  "error": "Producto no encontrado"
}
\`\`\`

---

### POST `/api/productos`

Crea un nuevo producto (requiere rol admin).

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Request Body:**
\`\`\`json
{
  "nombre": "Lechuga Romana",
  "descripcion": "Lechuga fresca y crujiente",
  "precio": 1500,
  "stock": 40,
  "categoria": "Verduras",
  "imagen": "/imagenes/lechuga.jpg",
  "unidad": "unidad",
  "disponible": true
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "data": {
    "producto": {
      "id": "prod789",
      "nombre": "Lechuga Romana",
      "descripcion": "Lechuga fresca y crujiente",
      "precio": 1500,
      "stock": 40,
      "categoria": "Verduras",
      "imagen": "/imagenes/lechuga.jpg",
      "unidad": "unidad",
      "destacado": false,
      "enOferta": false,
      "activo": true
    }
  }
}
\`\`\`

**Response (403):**
\`\`\`json
{
  "success": false,
  "error": "No tienes permisos para realizar esta acción"
}
\`\`\`

---

### PUT `/api/productos/[id]`

Actualiza un producto existente (requiere rol admin).

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**URL Parameters:**
- `id` (requerido): ID del producto

**Request Body:**
\`\`\`json
{
  "precio": 2800,
  "stock": 35,
  "disponible": true
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "producto": {
      "id": "prod123",
      "nombre": "Tomate Orgánico",
      "descripcion": "Tomates frescos cultivados sin pesticidas",
      "precio": 2800,
      "stock": 35,
      "categoria": "Verduras",
      "imagen": "/imagenes/tomate.jpg",
      "unidad": "kg",
      "destacado": true,
      "enOferta": false,
      "activo": true
    }
  }
}
\`\`\`

---

### DELETE `/api/productos/[id]`

Elimina un producto (requiere rol admin).

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**URL Parameters:**
- `id` (requerido): ID del producto

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
\`\`\`

**Response (403):**
\`\`\`json
{
  "success": false,
  "error": "No tienes permisos para realizar esta acción"
}
\`\`\`

---

## Usuarios

### GET `/api/usuarios`

Obtiene todos los usuarios (requiere rol admin).

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Query Parameters:**
- `rol` (opcional): Filtrar por rol (cliente, admin)

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuarios": [
      {
        "id": "user123",
        "email": "cliente@ejemplo.com",
        "nombre": "María",
        "apellido": "González",
        "rol": "cliente",
        "fechaRegistro": "2024-01-10T09:00:00Z"
      },
      {
        "id": "user456",
        "email": "admin@ejemplo.com",
        "nombre": "Pedro",
        "apellido": "Martínez",
        "rol": "admin",
        "fechaRegistro": "2024-01-01T08:00:00Z"
      }
    ],
    "total": 2
  }
}
\`\`\`

---

### GET `/api/usuarios/[id]`

Obtiene un usuario específico (requiere rol admin o ser el mismo usuario).

**Headers:**
\`\`\`
Cookie: pb_auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "user123",
      "email": "cliente@ejemplo.com",
      "nombre": "María",
      "apellido": "González",
      "telefono": "+56912345678",
      "direccion": "Calle Ejemplo 789",
      "ciudad": "Concepción",
      "region": "Región del Biobío",
      "codigoPostal": "4030000",
      "rol": "cliente",
      "fechaRegistro": "2024-01-10T09:00:00Z"
    }
  }
}
\`\`\`

---

## Estructura de Respuestas

Todas las respuestas de la API siguen el siguiente formato:

### Respuesta Exitosa
\`\`\`json
{
  "success": true,
  "data": {
    // Datos específicos del endpoint
  },
  "message": "Mensaje opcional"
}
\`\`\`

### Respuesta con Error
\`\`\`json
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE"
}
\`\`\`

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos de entrada inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado (sin permisos)
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Autenticación y Autorización

### JWT (JSON Web Tokens)

El sistema utiliza JWT para autenticación. Los tokens se almacenan en cookies httpOnly (`pb_auth`).

**Estructura del Token:**
\`\`\`json
{
  "id": "user123",
  "email": "usuario@ejemplo.com",
  "role": "cliente",
  "exp": 1705320000
}
\`\`\`

### Roles

- **cliente**: Usuario regular, puede ver productos y hacer compras
- **admin**: Administrador, puede gestionar productos, usuarios y órdenes

### Middleware de Protección

El archivo `middleware.ts` protege automáticamente las siguientes rutas:

- `/admin/*` - Solo admin
- `/mi-cuenta/*` - Usuarios autenticados
- `/checkout` - Usuarios autenticados

---

## Ejemplos de Uso

### Registro e Inicio de Sesión

\`\`\`javascript
// Registrar nuevo usuario
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'nuevo@usuario.com',
    password: 'contraseña123',
    passwordConfirm: 'contraseña123',
    nombre: 'Nuevo',
    apellido: 'Usuario'
  })
});

const data = await response.json();
console.log(data.data.usuario);

// Iniciar sesión
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Importante para cookies
  body: JSON.stringify({
    email: 'nuevo@usuario.com',
    password: 'contraseña123'
  })
});

const loginData = await loginResponse.json();
\`\`\`

### Obtener Productos

\`\`\`javascript
// Todos los productos
const productos = await fetch('/api/productos');
const data = await productos.json();

// Productos por categoría
const frutas = await fetch('/api/productos?categoria=Frutas');
const frutasData = await frutas.json();

// Producto específico
const producto = await fetch('/api/productos/prod123');
const productoData = await producto.json();
\`\`\`

### Crear Producto (Admin)

\`\`\`javascript
const nuevoProducto = await fetch('/api/productos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Envía la cookie de autenticación
  body: JSON.stringify({
    nombre: 'Zanahoria',
    descripcion: 'Zanahorias frescas',
    precio: 1800,
    stock: 60,
    categoria: 'Verduras',
    imagen: '/imagenes/zanahoria.jpg',
    unidad: 'kg',
    disponible: true
  })
});

const data = await nuevoProducto.json();
\`\`\`

---

## Integración con PocketBase

El proyecto utiliza PocketBase como backend. Para iniciar PocketBase:

\`\`\`bash
./pocketbase serve
\`\`\`

PocketBase estará disponible en `http://127.0.0.1:8090`

### Panel de Administración

Accede al panel de PocketBase en: `http://127.0.0.1:8090/_/`

---

## Notas Importantes

1. Todos los endpoints que modifican datos requieren autenticación
2. Los endpoints de admin verifican el rol del usuario
3. Las contraseñas deben tener mínimo 8 caracteres
4. Los precios se manejan en pesos chilenos (CLP)
5. Las imágenes deben ser URLs válidas o rutas relativas
