# Ejemplos de Uso de la API - Huerto Hogar

Este documento contiene ejemplos prácticos de cómo usar la API REST de Huerto Hogar desde el frontend.

## Tabla de Contenidos

1. [Autenticación](#autenticación)
2. [Productos](#productos)
3. [Perfil de Usuario](#perfil-de-usuario)
4. [Manejo de Errores](#manejo-de-errores)

---

## Autenticación

### Registrar Nuevo Usuario

\`\`\`typescript
// componentes/FormularioRegistro.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contextos/ContextoAuth';

export function FormularioRegistro() {
  const router = useRouter();
  const { registrarse } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await registrarse({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        nombre: formData.nombre,
        apellido: formData.apellido
      });

      // Usuario autenticado automáticamente después del registro
      router.push('/');
    } catch (error) {
      console.error('Error en registro:', error);
      // Mostrar error al usuario
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
\`\`\`

### Iniciar Sesión

\`\`\`typescript
// componentes/FormularioLogin.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contextos/ContextoAuth';
import { useToast } from '@/hooks/use-toast';

export function FormularioLogin() {
  const router = useRouter();
  const { iniciarSesion } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const exito = await iniciarSesion(email, password);

    if (exito) {
      toast({
        title: 'Bienvenido',
        description: 'Has iniciado sesión exitosamente'
      });
      router.push('/');
    } else {
      toast({
        title: 'Error',
        description: 'Email o contraseña incorrectos',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
\`\`\`

### Cerrar Sesión

\`\`\`typescript
// componentes/BotonCerrarSesion.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contextos/ContextoAuth';
import { Button } from '@/components/ui/button';

export function BotonCerrarSesion() {
  const router = useRouter();
  const { cerrarSesion } = useAuth();

  const handleLogout = () => {
    cerrarSesion();
    router.push('/');
  };

  return (
    <Button onClick={handleLogout} variant="ghost">
      Cerrar Sesión
    </Button>
  );
}
\`\`\`

---

## Productos

### Obtener Todos los Productos

\`\`\`typescript
// app/productos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerProductos } from '@/lib/api/productos';
import type { Producto } from '@/lib/tipos';

export default function PaginaProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarProductos() {
      try {
        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  if (cargando) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {productos.map((producto) => (
        <TarjetaProducto key={producto.id} producto={producto} />
      ))}
    </div>
  );
}
\`\`\`

### Obtener Productos por Categoría

\`\`\`typescript
// app/categorias/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerProductosPorCategoria } from '@/lib/api/productos';
import type { Producto } from '@/lib/tipos';

export default function PaginaCategoria({ params }: { params: { id: string } }) {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    async function cargar() {
      const datos = await obtenerProductosPorCategoria(params.id);
      setProductos(datos);
    }

    cargar();
  }, [params.id]);

  return (
    <div>
      <h1>Categoría: {params.id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  );
}
\`\`\`

### Crear Producto (Admin)

\`\`\`typescript
// app/admin/productos/nuevo/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crearProducto } from '@/lib/api/productos';
import { useToast } from '@/hooks/use-toast';

export default function PaginaNuevoProducto() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: 'Verduras',
    imagen: '',
    unidad: 'kg',
    disponible: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const producto = await crearProducto(formData);

      if (producto) {
        toast({
          title: 'Producto creado',
          description: 'El producto se ha creado exitosamente'
        });
        router.push('/admin/productos');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el producto',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
\`\`\`

### Actualizar Producto (Admin)

\`\`\`typescript
// app/admin/productos/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerProductoPorId, actualizarProducto } from '@/lib/api/productos';
import { useToast } from '@/hooks/use-toast';

export default function PaginaEditarProducto({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    disponible: true
  });

  useEffect(() => {
    async function cargar() {
      const producto = await obtenerProductoPorId(params.id);
      if (producto) {
        setFormData({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          disponible: producto.activo
        });
      }
    }

    cargar();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const producto = await actualizarProducto(params.id, formData);

    if (producto) {
      toast({
        title: 'Producto actualizado',
        description: 'Los cambios se han guardado exitosamente'
      });
      router.push('/admin/productos');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
\`\`\`

---

## Perfil de Usuario

### Actualizar Perfil

\`\`\`typescript
// app/mi-cuenta/perfil/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contextos/ContextoAuth';
import { useToast } from '@/hooks/use-toast';

export default function PaginaPerfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    telefono: usuario?.telefono || '',
    direccion: usuario?.direccion || '',
    ciudad: usuario?.ciudad || '',
    region: usuario?.region || '',
    codigoPostal: usuario?.codigoPostal || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const exito = await actualizarUsuario(formData);

    if (exito) {
      toast({
        title: 'Perfil actualizado',
        description: 'Tus cambios se han guardado exitosamente'
      });
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el perfil',
        variant: 'destructive'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
\`\`\`

---

## Manejo de Errores

### Hook Personalizado para API Calls

\`\`\`typescript
// hooks/use-api.ts
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = async (apiCall: () => Promise<T>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}
\`\`\`

### Uso del Hook

\`\`\`typescript
// Ejemplo de uso
function ComponenteEjemplo() {
  const { data, loading, error, execute } = useApi<Producto[]>();

  useEffect(() => {
    execute(() => obtenerProductos());
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return null;

  return (
    <div>
      {data.map(producto => (
        <div key={producto.id}>{producto.nombre}</div>
      ))}
    </div>
  );
}
\`\`\`

---

## Verificar Autenticación en Páginas

\`\`\`typescript
// app/mi-cuenta/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contextos/ContextoAuth';

export default function PaginaMiCuenta() {
  const router = useRouter();
  const { usuario, autenticado } = useAuth();

  useEffect(() => {
    if (!autenticado) {
      router.push('/login');
    }
  }, [autenticado, router]);

  if (!autenticado || !usuario) {
    return null; // O un spinner de carga
  }

  return (
    <div>
      <h1>Bienvenido, {usuario.nombre}</h1>
      {/* Contenido de la página */}
    </div>
  );
}
\`\`\`

---

## Verificar Rol de Admin

\`\`\`typescript
// app/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contextos/ContextoAuth';

export default function PaginaAdmin() {
  const router = useRouter();
  const { usuario, autenticado } = useAuth();

  useEffect(() => {
    if (!autenticado || usuario?.rol !== 'admin') {
      router.push('/login');
    }
  }, [autenticado, usuario, router]);

  if (!autenticado || usuario?.rol !== 'admin') {
    return null;
  }

  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* Contenido del admin */}
    </div>
  );
}
\`\`\`

---

**Nota:** Todos estos ejemplos asumen que ya tienes configurado PocketBase y las colecciones necesarias según `INSTRUCCIONES_POCKETBASE.md`.
