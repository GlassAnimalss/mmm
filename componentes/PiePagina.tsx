import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function PiePagina() {
  return (
    <footer className="bg-muted border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-2xl font-bold text-primary">🌱</div>
              <span className="text-lg font-bold text-foreground">
                Huerto Hogar
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Frutas y verduras frescas directo a tu hogar. Calidad y frescura
              garantizada.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/categorias"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  href="/ofertas"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Ofertas
                </Link>
              </li>
              <li>
                <Link
                  href="/nosotros"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link
                  href="/mi-cuenta"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Mi Cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Av. Providencia 1234, Santiago
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +56 9 1234 5678
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  contacto@huertohogar.cl
                </span>
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a
                href="https://www.facebook.com/tuhuertohogar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/huerto.hogar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/HuertoHogarCh?t=kq0j4A6ikdD75r0aJQqf7A&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4 text-center">
            Nuestra Ubicación
          </h3>
          <div className="w-full max-w-3xl mx-auto aspect-video rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.778629484115!2d-70.6209767!3d-33.429015299999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf62a3242b63%3A0x53f6f146ee47c6e4!2sNormandie%20Restaurant!5e0!3m2!1ses!2scl!4v1763436343776!5m2!1ses!2scl"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Huerto Hogar"
            />
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Huerto Hogar. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
