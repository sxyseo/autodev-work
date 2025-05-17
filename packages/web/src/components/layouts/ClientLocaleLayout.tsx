'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { AIAssistantProvider } from "@/context/AIAssistantContext";
import { AIAssistantWrapper } from "@/layout/AIAssistantWrapper";
import { TopNavigation } from "@/layout/navigation/TopNavigation";
import { SideNavigation } from "@/layout/navigation/SideNavigation";
import { locales, defaultLocale } from '../../../i18n';

interface ClientLocaleLayoutProps {
  children: ReactNode;
  locale: string;
}

export function ClientLocaleLayout({ children, locale: initialLocale }: ClientLocaleLayoutProps) {
  // 确保 locale 值有效
  const validLocale = locales.includes(initialLocale) ? initialLocale : defaultLocale;
  
  // 状态用于存储翻译消息
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 在客户端加载翻译
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const messages = await import(`../../../locales/${validLocale}.json`);
        setMessages(messages.default || {});
      } catch (error) {
        console.error(`Could not load messages for locale "${validLocale}"`, error);
        setMessages({});
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
  }, [validLocale]);
  
  // 显示加载状态
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
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
  );
} 