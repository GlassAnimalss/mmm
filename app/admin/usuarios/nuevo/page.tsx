'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contextos/ContextoAuth';
import { useToast } from '@/hooks/use-toast';
import { obtenerUsuariosAPI, crearUsuarioAPI } from '@/lib/api/usuarios';
import { Usuario } from '@/lib/tipos';
import NavegacionAdmin from '@/componentes/NavegacionAdmin';
import { validarTelefonoChileno, formatearTelefonoChileno, regionesChile } from '@/lib/utilidades';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PaginaNuevoUsuario() {
  const router = useRouter();
  const { usuario } = useAuth();
  const { toast } = useToast();
  const [cargando, setCargando] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    region: '',
    codigoPostal: '',
    rol: 'cliente' as 'cliente' | 'admin' | 'trabajador',
  });

  useEffect(() => {
    if (!usuario || usuario.rol !== 'admin') {
      router.push('/login');
    }
  }, [usuario]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);

    if (!formData.email || !formData.nombre || !formData.apellido) {
      toast({
        title: 'Error',
        description: 'Por favor completa los campos requeridos (email, nombre y apellido)',
        variant: 'destructive',
      });
      setCargando(false);
      return;
    }

    if (formData.telefono && !validarTelefonoChileno(formData.telefono)) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un número de teléfono chileno válido',
        variant: 'destructive',
      });
      setCargando(false);
      return;
    }

    try {
      await crearUsuarioAPI({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono ? formatearTelefonoChileno(formData.telefono) : '',
        direccion: formData.direccion || '',
        ciudad: formData.ciudad || '',
        region: formData.region || '',
        codigoPostal: formData.codigoPostal || '',
        rol: formData.rol,
      });

      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado exitosamente en el sistema',
      });

      router.push('/admin/usuarios');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el usuario',
        variant: 'destructive',
      });
    } finally {
      setCargando(false);
    }
  };



  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setFormData({ ...formData, telefono: valor });

    // Validar en tiempo real si hay valor
    if (valor && !validarTelefonoChileno(valor)) {
      setErrorTelefono('Formato inválido. Use +56912345678 o 912345678');
    } else {
      setErrorTelefono('');
    }
  };

  if (!usuario || usuario.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavegacionAdmin />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Nuevo Usuario</h1>
          <p className="text-muted-foreground mt-1">Agrega un nuevo usuario al sistema</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Usuario</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nombre *
                  </label>
                  <Input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Apellido *
                  </label>
                  <Input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) =>
                      setFormData({ ...formData, apellido: e.target.value })
                    }
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="usuario@ejemplo.cl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Contraseña *
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="********"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Confirmar Contraseña *
                  </label>
                  <Input
                    type="password"
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      setFormData({ ...formData, passwordConfirm: e.target.value })
                    }
                    placeholder="********"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Teléfono</label>
                <Input
                  type="tel"
                  value={formData.telefono}
                  onChange={handleTelefonoChange}
                  placeholder="+56912345678 o 912345678"
                  className={errorTelefono ? 'border-destructive' : ''}
                />
                {errorTelefono && (
                  <p className="text-sm text-destructive mt-1">{errorTelefono}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Formato: +56912345678 o 912345678
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Dirección</label>
                <Input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                  placeholder="Av. Principal 123"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ciudad</label>
                  <Input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) =>
                      setFormData({ ...formData, ciudad: e.target.value })
                    }
                    placeholder="Santiago"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Región</label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) =>
                      setFormData({ ...formData, region: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una región" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionesChile.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Código Postal</label>
                  <Input
                    type="text"
                    value={formData.codigoPostal}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoPostal: e.target.value })
                    }
                    placeholder="8320000"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Rol *</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={formData.rol}
                  onChange={(e) =>
                    setFormData({ ...formData, rol: e.target.value as 'cliente' | 'admin' | 'trabajador' })
                  }
                  required
                >
                  <option value="cliente">Cliente</option>
                  <option value="trabajador">Trabajador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={cargando} className="flex-1">
                  {cargando ? 'Creando...' : 'Crear Usuario'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/usuarios')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
