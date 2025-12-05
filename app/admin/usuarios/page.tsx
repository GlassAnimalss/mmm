'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Search, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import NavegacionAdmin from '@/componentes/NavegacionAdmin';
import { useAuth } from '@/contextos/ContextoAuth';
import { obtenerUsuariosAPI } from '@/lib/api/usuarios';
import { obtenerOrdenesAPI } from '@/lib/api/ordenes';
import { Usuario } from '@/lib/tipos';

export default function PaginaAdminUsuarios() {
  const router = useRouter();
  const { usuario: usuarioActual, autenticado } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [ordenesCount, setOrdenesCount] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!autenticado || usuarioActual?.rol !== 'admin') {
      router.push('/login');
      return;
    }

    const cargarDatos = async () => {
      try {
        const [todosUsuarios, todasOrdenes] = await Promise.all([
          obtenerUsuariosAPI(),
          obtenerOrdenesAPI()
        ]);

        setUsuarios(todosUsuarios);
        setUsuariosFiltrados(todosUsuarios);

        // Contar órdenes por usuario
        const conteo: Record<string, number> = {};
        todosUsuarios.forEach((u) => {
          conteo[u.id] = todasOrdenes.filter((o) => o.usuarioId === u.id).length;
        });
        setOrdenesCount(conteo);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatos();
  }, [autenticado, usuarioActual, router]);

  useEffect(() => {
    let resultado = [...usuarios];

    if (busqueda) {
      resultado = resultado.filter(
        (u) =>
          u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
          u.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setUsuariosFiltrados(resultado);
  }, [busqueda, usuarios]);

  if (!autenticado || usuarioActual?.rol !== 'admin') {
    return null;
  }

  return (
    <>
      <NavegacionAdmin />
      <main className="min-h-screen py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Gestión de Usuarios
              </h1>
              <p className="text-muted-foreground">
                Administra los usuarios del sistema
              </p>
            </div>
            <Link href="/admin/usuarios/nuevo">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" /> Nuevo Usuario
              </Button>
            </Link>
          </div>

          {/* Búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de usuarios */}
          <div className="space-y-4">
            {usuariosFiltrados.map((usuario) => (
              <Card key={usuario.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {usuario.nombre} {usuario.apellido}
                        </h3>
                        <Badge
                          variant={
                            usuario.rol === 'admin' ? 'default' : 'secondary'
                          }
                        >
                          {usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {usuario.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ordenesCount[usuario.id] || 0} pedido(s) realizados
                      </p>
                    </div>
                    <Link href={`/admin/usuarios/${usuario.id}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-4 w-4" /> Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
