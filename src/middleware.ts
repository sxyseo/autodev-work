import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale} from '../i18n';
import { NextRequest, NextResponse } from 'next/server';

// 创建 next-intl 中间件
const intlMiddleware = createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 关闭自动语言检测，避免循环重定向
  localeDetection: false
});

// 导出中间件函数
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 根路径重定向到默认语言
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }
  
  // 处理其他路径
  return intlMiddleware(request);
}

// 配置匹配的路由
export const config = {
  // 匹配所有路径 (除了 API 路由, 静态文件等)
  matcher: ['/((?!api|_next|.*\\..*).*)', '/']
}; 