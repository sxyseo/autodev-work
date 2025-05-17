import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale} from '../../i18n';

export default getRequestConfig(async ({locale}) => {
  // 确保 locale 是有效的字符串，否则使用默认语言
  const validLocale = locale && locales.includes(locale) ? locale : defaultLocale;
  
  return {
    locale: validLocale,
    messages: (await import(`../../locales/${validLocale}.json`)).default
  };
}); 