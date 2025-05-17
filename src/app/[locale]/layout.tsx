import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import { locales } from '../../../i18n';
import ClientLocaleProvider from '@/components/layouts/ClientLocaleProvider';

const inter = Inter({ subsets: ['latin'] });

// 预渲染所有支持的语言路径
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 在服务器组件中使用参数
export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 由于直接使用 params.locale 会导致 Next.js 15 的错误
  // 我们将 locale 值字符串化后传给客户端组件
  // 而不是直接在服务器组件中使用它
  return (
    <html>
      <body className={inter.className}>
        <ClientLocaleProvider localeFromParams={JSON.stringify(params)}>
          {children}
        </ClientLocaleProvider>
      </body>
    </html>
  );
} 