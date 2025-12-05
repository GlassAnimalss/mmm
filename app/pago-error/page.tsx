import Link from 'next/link';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import NavegacionPublica from '@/componentes/NavegacionPublica';
import PiePagina from '@/componentes/PiePagina';

export default function PaginaPagoError() {
  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 rounded-full mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Error en el Pago
            </h1>
            <p className="text-xl text-muted-foreground">
              Hubo un problema al procesar tu pago
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-4">¿Qué sucedió?</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                No pudimos procesar tu pago en este momento. Esto puede deberse a
                varios motivos como fondos insuficientes, datos incorrectos o
                problemas con el procesador de pagos.
              </p>

              <h3 className="font-semibold mb-3">¿Qué puedes hacer?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Verifica que los datos de tu tarjeta sean correctos</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Asegúrate de tener fondos suficientes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Intenta con otro método de pago</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Contacta a tu banco si el problema persiste</span>
                </li>
              </ul>

              <p className="text-sm text-muted-foreground">
                Los productos permanecen en tu carrito. Puedes intentar nuevamente
                cuando estés listo.
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/checkout" className="flex-1">
              <Button className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" /> Intentar Nuevamente
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" /> Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <PiePagina />
    </>
  );
}
