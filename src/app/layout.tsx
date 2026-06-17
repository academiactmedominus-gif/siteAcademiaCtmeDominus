import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/authContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsappCTA from "@/components/WhatsappCTA";

export const metadata: Metadata = {
  title: "Academia Dominus - Seu Corpo Aguenta Quase Tudo",
  description: "Treine na academia mais completa com Musculação, Jiu-Jitsu e Treinamento Multi-Funcional. Consulte planos e preços pelo WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" style={{ scrollBehavior: "smooth" }}>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column", paddingTop: "80px" }}>
        <AuthProvider>
          <Header />
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {children}
          </main>
          <Footer />
          <WhatsappCTA />
        </AuthProvider>
      </body>
    </html>
  );
}
