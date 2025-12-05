# Instrucciones para usar PocketBase en tu proyecto

## Paso 1: Instalar dependencias

Después de descargar el proyecto, ejecuta en la terminal:

\`\`\`bash
npm install pocketbase
\`\`\`

## Paso 2: Iniciar PocketBase

1. Ve a la carpeta donde tienes `pocketbase.exe`
2. Ejecuta desde CMD: `pocketbase.exe serve`
3. PocketBase debe estar corriendo en `http://127.0.0.1:8090`

## Paso 3: Configurar colecciones en PocketBase

1. Abre el panel de PocketBase: `http://127.0.0.1:8090/_/`
2. Crea una cuenta de administrador si es la primera vez

### Colección: productos

Campos:
- `nombre` (text, required)
- `descripcion` (text, required)
- `precio` (number, required)
- `precioOferta` (number, optional)
- `stock` (number, required, default: 0)
- `categoria` (relation → categorias, required)
- `imagen` (file - image, max 5MB)
- `unidad` (select: "kg", "unidad", "manojo", "bandeja", required)
- `destacado` (bool, default: false)
- `enOferta` (bool, default: false)
- `activo` (bool, default: true)

**API Rules:**
\`\`\`
List/Search: vacío (público)
View: vacío (público)
Create: @request.auth.rol = "admin"
Update: @request.auth.rol = "admin"
Delete: @request.auth.rol = "admin"
\`\`\`

### Colección: categorias

Campos:
- `nombre` (text, required)
- `descripcion` (text)
- `imagen` (file - image, max 5MB)
- `activa` (bool, default: true)

**API Rules:**
\`\`\`
List/Search: vacío (público)
View: vacío (público)
Create: @request.auth.rol = "admin"
Update: @request.auth.rol = "admin"
Delete: @request.auth.rol = "admin"
\`\`\`

### Colección: users (ya existe por defecto)

Campos adicionales a agregar:
- `nombre` (text, required)
- `apellido` (text, required)
- `telefono` (text, optional)
- `direccion` (text, optional)
- `ciudad` (text, optional)
- `region` (text, optional)
- `codigoPostal` (text, optional)
- `rol` (select: "admin", "cliente", required, default: "cliente")

**API Rules:**
\`\`\`
List/Search: @request.auth.id != ""
View: @request.auth.id != "" && (id = @request.auth.id || @request.auth.rol = "admin")
Create: vacío (público para registro)
Update: @request.auth.id = id || @request.auth.rol = "admin"
Delete: @request.auth.rol = "admin"
\`\`\`

**Importante:** Marca `emailVisibility` como `true` en la configuración de la colección users.

### Colección: pedidos

Campos:
- `usuario` (relation → users, required)
- `productos` (JSON, required) - Array de productos con cantidad y precios
- `total` (number, required, min: 0)
- `estado` (select: "pendiente", "procesando", "enviado", "entregado", "cancelado", default: "pendiente")
- `direccion_envio` (JSON, required) - Objeto con datos de envío
- `metodo_pago` (text)
- `notas` (text - long)

**API Rules:**
\`\`\`
List/Search: @request.auth.id != "" && (usuario = @request.auth.id || @request.auth.rol = "admin")
View: @request.auth.id != "" && (usuario = @request.auth.id || @request.auth.rol = "admin")
Create: @request.auth.id != ""
Update: @request.auth.rol = "admin"
Delete: @request.auth.rol = "admin"
\`\`\`

## Paso 4: Agregar productos de prueba

Agrega al menos 3-5 productos para probar la aplicación. Primero crea las categorías, luego los productos.

## Paso 5: Crear usuario administrador

1. Regístrate desde la aplicación (se creará como "cliente")
2. Ve al panel de PocketBase → Collections → users
3. Edita tu usuario y cambia el campo `rol` a "admin"

O créalo directamente desde PocketBase:
- Email: admin@huertohogar.cl
- Password: admin123 (mínimo 8 caracteres)
- Nombre: Admin
- Apellido: Sistema
- Rol: admin

## Paso 6: Iniciar tu proyecto Next.js

\`\`\`bash
npm run dev
\`\`\`

## Estructura de archivos:

- `lib/pocketbase.ts` - Cliente de PocketBase configurado
- `lib/api/productos.ts` - Funciones para productos
- `lib/api/categorias.ts` - Funciones para categorías
- `lib/api/ordenes.ts` - Funciones para órdenes/pedidos
- `lib/api/auth.ts` - Funciones para autenticación
- `app/api/productos/route.ts` - API Route de Next.js para productos
- `app/api/categorias/route.ts` - API Route para categorías
- `app/api/ordenes/route.ts` - API Route para órdenes
- `app/api/auth/*` - API Routes para autenticación (login, registro, logout)
- `contextos/ContextoAuth.tsx` - Contexto de autenticación con PocketBase
- `middleware.ts` - Protección de rutas según roles

## Endpoints API disponibles:

Ver documentación completa en: http://localhost:3000/api-docs

### Autenticación
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Productos
- GET /api/productos
- GET /api/productos/[id]
- POST /api/productos (Admin)
- PUT /api/productos/[id] (Admin)
- DELETE /api/productos/[id] (Admin)

### Categorías
- GET /api/categorias
- GET /api/categorias/[id]
- POST /api/categorias (Admin)
- PUT /api/categorias/[id] (Admin)
- DELETE /api/categorias/[id] (Admin)

### Órdenes
- GET /api/ordenes (Admin - todas)
- GET /api/ordenes/[id]
- GET /api/ordenes/usuario/[usuarioId]
- POST /api/ordenes
- PUT /api/ordenes/[id] (Admin)
- DELETE /api/ordenes/[id] (Admin)

## Estado del proyecto:

1. ✅ Integración con PocketBase para productos
2. ✅ Integración con PocketBase para categorías
3. ✅ Integración con PocketBase para órdenes
4. ✅ Sistema de autenticación con PocketBase y JWT
5. ✅ Roles de usuario (admin/cliente)
6. ✅ Protección de rutas admin con middleware
7. ✅ Documentación API interactiva tipo Swagger
8. ✅ Panel de administración completo

## Próximos pasos opcionales:

1. Migrar datos locales existentes a PocketBase
2. Agregar paginación en listados
3. Implementar búsqueda avanzada
4. Agregar notificaciones en tiempo real
5. Implementar caché con SWR
