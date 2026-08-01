import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Match Argentina",
  description: "Descubrí qué ciudades argentinas encajan con la vida que querés.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
