import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Match Argentina",
  description: "Descubrí qué ciudades argentinas encajan con la vida que querés.",
};

export const viewport: Viewport = {
  themeColor: "#f3efe5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body><a className="skip-link" href="#main-content">Saltar al contenido</a>{children}</body>
    </html>
  );
}
