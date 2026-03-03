import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // استدعاء الهيدر الجديد

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "عسير فالي | منصة الاستثمار الاستراتيجية",
  description: "المنصة الرسمية لتحليل وتخصيص الفرص الاستثمارية في منطقة عسير",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${ibmPlexArabic.variable} antialiased font-sans bg-[#F8FAFC]`}>
        
        {/* الهيدر الذي بنيناه وتم ربطه بقاعدة البيانات */}
        <Navbar />

        {/* محتوى الصفحات */}
        {children}
        
      </body>
    </html>
  );
}