import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import "./city-postcard.css";

const brandFont = Quicksand({
  subsets: ["latin"],
  variable: "--font-brand",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL ?? "https://lifearg.diegodella.ar"),
  title: "Life Match Argentina",
  description: "Descubrí qué ciudades argentinas encajan con la vida que querés.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_AR", siteName: "Life Match Argentina", title: "Life Match Argentina", description: "Descubrí qué ciudades argentinas encajan con la vida que querés." },
};

export const viewport: Viewport = {
  themeColor: "#f3efe5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={brandFont.variable} lang="es">
      <body><a className="skip-link" href="#main-content">Saltar al contenido</a>{children}</body>
    </html>
  );
}
