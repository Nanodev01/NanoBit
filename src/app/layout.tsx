import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nanobit.me | Software Programmer & Cybersecurity",
  description: "Portfolio de desarrollo de software y ciberseguridad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <body className={`${geistSans.variable} ${jetbrainsMono.variable} antialiased bg-black text-slate-300 font-sans`}>
        {children}
      </body>
    </html>
  );
}
