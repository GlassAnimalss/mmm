import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ProveedorAuth } from '@/contextos/ContextoAuth'
import { ProveedorCarrito } from '@/contextos/ContextoCarrito'
import { Toaster } from '@/components/ui/toaster'
import { ScrollAlInicio } from '@/componentes/ScrollAlInicio'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Huerto Hogar - Frutas y Verduras Frescas',
  description: 'Tienda online de frutas y verduras frescas',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <ProveedorAuth>
          <ProveedorCarrito>
            <ScrollAlInicio />
            {children}
          </ProveedorCarrito>
        </ProveedorAuth>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
