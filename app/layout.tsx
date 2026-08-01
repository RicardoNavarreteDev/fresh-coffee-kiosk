import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Fresh Coffee | Quiosco Digital',
    template: '%s | Fresh Coffee',
  },
  description: "Quiosco digital para tomar pedidos, administrar productos, controlar stock y mostrar órdenes listas en una experiencia moderna para clientes y administración.",
  applicationName: 'Fresh Coffee',
  keywords: ['quiosco digital', 'cafetería', 'Next.js', 'Prisma', 'pedidos', 'admin panel'],
  openGraph: {
    title: 'Fresh Coffee | Quiosco Digital',
    description: 'Sistema web para pedidos, panel administrativo, catálogo, stock y pantalla pública de órdenes listas.',
    type: 'website',
    locale: 'es_CL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Coffee | Quiosco Digital',
    description: 'Sistema web para pedidos, panel administrativo, catálogo y órdenes listas.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
