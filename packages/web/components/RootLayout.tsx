'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { AIAssistantProvider } from "@/context/AIAssistantContext";
import { AIAssistantWrapper } from "@/layout/AIAssistantWrapper";
import { TopNavigation } from "@/layout/navigation/TopNavigation";
import { SideNavigation } from "@/layout/navigation/SideNavigation";

const inter = Inter({ subsets: ['latin'] });

interface RootLayoutProps {
  children: ReactNode;
  locale: string;
}

export default function RootLayout({ children, locale }: RootLayoutProps) {
  // 状态用于存储翻译消息
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 在客户端加载翻译
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const messages = await import(`../locales/${locale}.json`);
        setMessages(messages.default || {});
      } catch (error) {
        console.error(`Could not load messages for locale "${locale}"`, error);
        setMessages({});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [locale]);
  
  // 显示加载状态
  if (isLoading) {
    return (
      <html lang={locale}>
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </body>
      </html>
    );
  }
  
  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 