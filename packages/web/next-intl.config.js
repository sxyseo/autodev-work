/** @type {import('next-intl').NextIntlConfig} */
const config = {
  locales: ['zh', 'en', 'ja'],
  defaultLocale: 'zh',
  localeDetection: true,
  // 这允许配置时区等其他选项
};

module.exports = config; 