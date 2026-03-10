import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StatsBet — Análise Estatística de Futebol",
  description: "Plataforma de análise estatística de futebol. H2H, xG, odds comparativas e índice de apostabilidade. Informação para quem quer analisar melhor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <AuthProvider>
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-w-0 pt-16 lg:pl-64">
              <div className="p-4 lg:p-6">{children}</div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
