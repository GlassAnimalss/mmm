import Image from 'next/image';
import { Leaf, Users, Award, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import NavegacionPublica from '@/componentes/NavegacionPublica';
import PiePagina from '@/componentes/PiePagina';

export default function PaginaNosotros() {
  return (
    <>
      <NavegacionPublica />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Sobre Huerto Hogar
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Conectando a las familias chilenas con productos frescos y naturales
              desde 2020
            </p>
          </div>
        </section>

        {/* Historia */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image
                  src="/verduras-frescas.jpg"
                  alt="Nuestra historia"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Nuestra Historia
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Huerto Hogar nació de la pasión por llevar alimentos frescos y
                  saludables a cada hogar chileno. Comenzamos como un pequeño
                  huerto familiar en las afueras de Santiago, cultivando frutas y
                  verduras orgánicas para nuestra comunidad.
                </p>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Con el tiempo, nos expandimos para servir a miles de familias,
                  siempre manteniendo nuestro compromiso con la calidad, frescura y
                  el trato personalizado que nos caracteriza.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoy, trabajamos directamente con agricultores locales para
                  ofrecerte los mejores productos al mejor precio, apoyando la
                  economía local y promoviendo una alimentación saludable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 px-4 bg-muted">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Nuestros Valores
              </h2>
              <p className="text-muted-foreground">
                Los principios que guían nuestro trabajo día a día
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Naturalidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Productos 100% naturales sin químicos ni pesticidas
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Comunidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Apoyamos a agricultores locales y economía regional
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Calidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Selección rigurosa para garantizar la mejor calidad
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Compromiso</h3>
                  <p className="text-sm text-muted-foreground">
                    Dedicación total a la satisfacción de nuestros clientes
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">5+</div>
                <p className="text-muted-foreground">Años de experiencia</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">10k+</div>
                <p className="text-muted-foreground">Clientes satisfechos</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Productos disponibles</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  );
}
