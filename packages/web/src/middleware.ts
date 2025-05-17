import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表
const locales = ['zh', 'en', 'ja'];
// 默认语言
const defaultLocale = 'zh';

export default function middleware(request: NextRequest) {
  // 获取当前路径
  const { pathname } = request.nextUrl;

  // 如果是根路径，重定向到默认语言
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // 其他路径直接通过
  return NextResponse.next();
}

export const config = {
  // 只匹配根路径
  matcher: ['/']
}; 