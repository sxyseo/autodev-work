import React from 'react';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import { AIAssistantProvider } from "@/context/AIAssistantContext";
import { AIAssistantWrapper } from "@/layout/AIAssistantWrapper";
import { TopNavigation } from "@/layout/navigation/TopNavigation";
import { SideNavigation } from "@/layout/navigation/SideNavigation";
import { notFound } from 'next/navigation';
import { LocaleProvider } from '@/components/layouts/LocaleProvider';

const inter = Inter({ subsets: ['latin'] });

// 支持的语言列表
const locales = ['zh', 'en', 'ja'];

// 预渲染支持的所有语言路径
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 安全地获取locale参数
  const locale = await Promise.resolve(params.locale);
  
  // 验证语言参数
  if (!locales.includes(locale)) {
    notFound();
  }
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <LocaleProvider locale={locale}>
          <AIAssistantProvider>
            <div className="min-h-screen bg-white flex flex-col">
              <TopNavigation />
              <div className="flex flex-1">
                <SideNavigation />
                <main className="flex-1 overflow-auto">
                  {children}
                </main>
              </div>
              <AIAssistantWrapper />
            </div>
          </AIAssistantProvider>
        </LocaleProvider>
      </body>
    </html>
  );
} 