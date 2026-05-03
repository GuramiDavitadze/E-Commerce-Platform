import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import styles from "./layout.module.scss"
import '@/styles/global.scss'

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
        <main className={styles.main}>
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
