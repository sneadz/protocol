import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterSW from "./RegisterSW";

export const metadata: Metadata = {
  title: "Protocol",
  description: "Suivi d'entraînement hebdomadaire",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "Protocol", statusBarStyle: "default" },
  icons: { apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-neutral-900 antialiased">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
