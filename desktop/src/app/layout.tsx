import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboard Koperasi Sukamaju",
  description: "Portal Anggota & Transparansi Tata Kelola Koperasi Merah Putih Desa Sukamaju",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0b0f19] text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
