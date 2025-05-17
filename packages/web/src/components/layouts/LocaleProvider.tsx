import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren } from 'react';

// 获取指定locale的翻译消息
async function getMessages(locale: string) {
  try {
    return (await import(`../../../locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Could not load messages for locale "${locale}"`, error);
    return {};
  }
}

// 服务器组件：预先加载翻译消息
export async function LocaleProvider({
  children,
  locale,
}: PropsWithChildren<{ locale: string }>) {
  // 异步加载翻译消息
  const messages = await getMessages(locale);
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
} 