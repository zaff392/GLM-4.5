import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GLM 4.5 Terminal - Interface de conversation avancée",
  description: "Terminal personnalisé pour interagir avec le modèle GLM 4.5. Interface intuitive avec thèmes personnalisables et fonctionnalités avancées.",
  keywords: ["GLM 4.5", "Terminal", "Chat", "IA", "Z.ai", "Next.js", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "GLM 4.5 Team" }],
  openGraph: {
    title: "GLM 4.5 Terminal",
    description: "Interface de conversation avancée avec GLM 4.5",
    url: "https://chat.z.ai",
    siteName: "GLM 4.5",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GLM 4.5 Terminal",
    description: "Interface de conversation avancée avec GLM 4.5",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
