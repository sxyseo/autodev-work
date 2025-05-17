import { notFound } from 'next/navigation';

export const locales = ['zh', 'en', 'ja'];
export const defaultLocale = 'zh';

// 获取当前请求中的语言
export function getLocale(request) {
  const locale = request.nextUrl.pathname.split('/')[1];
  
  if (!locales.includes(locale)) return defaultLocale;
  return locale;
}

// 这个函数用于路由拦截，如果访问不支持的语言，返回404
export async function checkLocale(locale) {
  const resolvedLocale = await Promise.resolve(locale);
  if (!locales.includes(resolvedLocale)) notFound();
} 