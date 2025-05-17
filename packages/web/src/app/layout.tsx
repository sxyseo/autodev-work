import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { defaultLocale } from '../../i18n';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutoDev Workbench",
  description: "AI-Powered AutoDevelopment Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 不再使用硬编码的重定向
  // 由middleware处理根路径重定向
  return (
    <html>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
