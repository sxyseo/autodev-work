'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { AIAssistantProvider } from "@/context/AIAssistantContext";
import { AIAssistantWrapper } from "@/layout/AIAssistantWrapper";
import { TopNavigation } from "@/layout/navigation/TopNavigation";
import { SideNavigation } from "@/layout/navigation/SideNavigation";
import { locales, defaultLocale } from '../../../i18n';

interface ClientLocaleProviderProps {
  children: ReactNode;
  localeFromParams: string;
}

export default function ClientLocaleProvider({ 
  children, 
  localeFromParams 
}: ClientLocaleProviderProps) {
  // 安全地解析JSON字符串获取locale
  const [locale, setLocale] = useState(defaultLocale);
  
  useEffect(() => {
    try {
      const params = JSON.parse(localeFromParams);
      const localeValue = params?.locale || defaultLocale;
      // 确保 locale 值有效
      setLocale(locales.includes(localeValue) ? localeValue : defaultLocale);
    } catch (error) {
      console.error('解析locale参数失败:', error);
      setLocale(defaultLocale);
    }
  }, [localeFromParams]);
  
  // 状态用于存储翻译消息
  const [messages, setMessages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // 在客户端加载翻译
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const messages = await import(`../../../locales/${locale}.json`);
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
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return (
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
  );
} 