"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModelSelector } from "@/components/biz-ui/model-selector"
import { Search, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAIAssistant } from "@/context/AIAssistantContext"
import { useTranslations } from 'next-intl'

export function TopNavigation() {
	const pathname = usePathname()
	const { isOpen, toggleAssistant } = useAIAssistant()
	const t = useTranslations()
	const router = useRouter()
	const locales = [
		{ code: 'zh', label: '中文' },
		{ code: 'en', label: 'EN' },
		{ code: 'ja', label: '日本語' },
	]

	const currentLocale = pathname.split('/')[1] || 'zh';

	const navigationItems = [
		{ name: t('nav.cockpit'), href: "/cockpit" },
		{ name: t('nav.platform'), href: "/platform" },
		{ name: t('nav.aihub'), href: "/ai-hub" },
		{ name: t('nav.aitools'), href: "/ai-tools" },
		{ name: t('nav.metrics'), href: "/metrics" },
	]

	// 我们使用直接链接而不是本地化路径，因为中间件会处理路由重写
	const getLocalizedPath = (path: string): string => {
		if (path === '/') {
			return `/${currentLocale}`;
		}
		return `/${currentLocale}${path}`;
	};

	// 比较路径时需要考虑可能的重写
	const isPathActive = (itemPath: string): boolean => {
		const localizedPath = getLocalizedPath(itemPath);
		// 首先检查完全匹配
		if (pathname === localizedPath) return true;
		
		// 如果不是完全匹配，检查是否是子路径
		if (itemPath !== '/' && pathname.startsWith(localizedPath + '/')) return true;
		
		return false;
	};

	return (
		<nav className="bg-white border-b border-gray-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<div className="flex-shrink-0 flex items-center pr-2">
							<Link href={getLocalizedPath('/')}>
								<span className="text-xl text-gray-900 brand ">{t('nav.brand')}</span>
							</Link>
						</div>
						<div className="hidden sm:ml-6 sm:flex sm:space-x-8">
							{navigationItems.map((item) => (
								<Link
									key={item.name}
									href={getLocalizedPath(item.href)}
									className={cn(
										"inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
										isPathActive(item.href)
											? "border-indigo-500 text-gray-900"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
									)}
								>
									{item.name}
								</Link>
							))}
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<ModelSelector/>
						<Button
							type="button"
							className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<Search className="h-4 w-4 mr-1"/>
							<span>{t('nav.search')}</span>
						</Button>
						<Button
							variant={isOpen ? "secondary" : "ghost"}
							size="icon"
							onClick={toggleAssistant}
							className="relative"
						>
							<MessageSquare className="h-5 w-5" />
							<span className="sr-only">{t('nav.aiassistant')}</span>
							{!isOpen && (
								<span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
									AI
								</span>
							)}
						</Button>
						<select
							className="ml-2 border rounded px-2 py-1 text-sm"
							value={currentLocale}
							onChange={e => {
								const nextLocale = e.target.value;
								const path = `/${nextLocale}${pathname.replace(/^\/(zh|en|ja)/, '')}`;
								router.push(path);
							}}
						>
							{locales.map(l => (
								<option key={l.code} value={l.code}>{l.label}</option>
							))}
						</select>
					</div>
				</div>
			</div>
		</nav>
	)
}
