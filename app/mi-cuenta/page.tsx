'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavegacionPublica from '@/componentes/NavegacionPublica';
import PiePagina from '@/componentes/PiePagina';
import { useAuth } from '@/contextos/ContextoAuth';

export default function PaginaMiCuenta() {
  const router = useRouter();
  const { usuario, autenticado, cerrarSesion } = useAuth();

  useEffect(() => {
    if (!autenticado) {
      router.push('/login');
    }
  }, [autenticado, router]);

  if (!autenticado || !usuario) {
    return null;
  }

  const handleCerrarSesion = () => {
    cerrarSesion();
    router.push('/');
  };

  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Mi Cuenta</h1>
            <p className="text-muted-foreground">
              Bienvenido, {usuario.nombre} {usuario.apellido}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/mi-cuenta/perfil">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Mi Perfil</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ver y editar tu información personal
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mi-cuenta/pedidos">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>Mis Pedidos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Revisa el historial y estado de tus pedidos
                  </p>
                </CardContent>
              </Card>
            </Link>

            {usuario.rol === "admin" && (
              <Link href="/admin">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-primary/50 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>Panel de Admin</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Gestiona productos, órdenes y usuarios
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Cerrar Sesión</h3>
                  <p className="text-sm text-muted-foreground">
                    Sal de tu cuenta de manera segura
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCerrarSesion}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" /> Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
