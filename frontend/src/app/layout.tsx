import type { Metadata } from "next";
import '@/styles/global.scss'
import Navbar from "@/components/layout/Navbar/Navbar";

export const metadata: Metadata = {
  title: "E-Commerce",
  description: "E-Commerce Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        
      </body>
    </html>
  );
}
