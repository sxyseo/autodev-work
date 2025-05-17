import { redirect } from 'next/navigation';
import { defaultLocale } from '../../i18n';

export default function RootPage() {
	// 保留重定向逻辑作为备份，以防middleware未触发
	redirect(`/${defaultLocale}`);
	
	// 这部分代码不会执行
	return null;
}
