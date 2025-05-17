'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function Home() {
	const [activeSection, setActiveSection] = useState<string | null>(null)

	const handleSectionClick: (sectionId: React.SetStateAction<string | null>) => void = (sectionId: React.SetStateAction<string | null>) => {
		setActiveSection(sectionId)
		// Here you could add additional logic to navigate, display info, etc.
	}

	return (
		<div className="p-8">
			<PlatformEngFlow onClickSection={handleSectionClick} />
			{activeSection && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full">
					{/* 使用 home.selected 文本 */}
					<span>{activeSection && activeSection}</span>
				</div>
			)}
		</div>
	)
}

type PlatformEngFlowProps = {
	onClickSection?: (sectionId: string) => void;
}

const PlatformEngFlow = ({ onClickSection }: PlatformEngFlowProps) => {
	const handleSectionClick = (sectionId: string) => {
		if (onClickSection) {
			onClickSection(sectionId)
		}
	}
	const t = useTranslations('home');
	const clickableStyle = { cursor: 'pointer' }

	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
			<svg width="1200px" height="482px" viewBox="-100 0 802 482" version="1.1" xmlns="http://www.w3.org/2000/svg"
			     xmlnsXlink="http://www.w3.org/1999/xlink">
				<title>PlatformEngFlow</title>
				<desc>Platform Engineering Flow Diagram</desc>
				<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
					<g id="sample" transform="translate(1.000000, 1.000000)">
						{/* Main Layer Group */}
						<g id="main-layers">
							<g id="user-touchpoints-container">
								<rect id="Rectangle" stroke="#FFA500" strokeWidth="2" fill="#FFFFFF" fillRule="nonzero" x="5" y="0"
								      width="500" height="120" rx="8"></rect>
								<text id="用户触点-title" fill="#FFA500" fontFamily="PingFangSC-Semibold, PingFang SC" fontSize="18"
								      fontWeight="500">
									<tspan x="37" y="31">{t('userTouchpoint')}</tspan>
								</text>
								<text id="--低代码系统，快速-UI/原型构建" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="37" y="70">-</tspan>
									<tspan x="45.5517578" y="70" fontFamily="PingFangSC-Regular, PingFang SC">{t('lowCode')}</tspan>
								</text>
								<text id="--AI-赋能模板应用，终端用户产品" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="37" y="95">- </tspan>
									<tspan x="45.5517578" y="95" fontFamily="PingFangSC-Regular, PingFang SC">{t('aiTemplate')}</tspan>
								</text>
								<g onClick={() => handleSectionClick('low-code')} style={clickableStyle}>
									<rect id="Rectangle-lowcode" stroke="#FFA500" fillOpacity="0.2" fill="#FFA500" fillRule="nonzero" x="340" y="62" width="140" height="54" rx="5"></rect>
									<text id="低代码系统-label" fill="#FFA500" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal">
										<tspan x="355" y="92">{t('lowCodeEnhance')}</tspan>
									</text>
								</g>
								<g onClick={() => handleSectionClick('ai-templates')} style={clickableStyle}>
									<rect id="Rectangle-aitemplate" stroke="#800080" fillOpacity="0.2" fill="#800080" fillRule="nonzero" x="340" y="4" width="140" height="54" rx="5"></rect>
									<text id="AI模板应用-label" fill="#800080" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal">
										<tspan x="355" y="36">{t('aiTemplateEnhance')}</tspan>
									</text>
								</g>
							</g>

							<g transform="translate(260.000000, 130.000000)" id="Arrow-1" stroke="#FFD700" strokeWidth="2">
								<path d="M10,0 L10,30 M0,20 L10,30 L20,20"></path>
							</g>

							{/* 中间层 Section Container (no longer clickable itself) */}
							<g id="middle-layer-container" transform="translate(0.000000, 180.000000)">
								<rect id="Rectangle" stroke="#008000" strokeWidth="2" fill="#FFFFFF" fillRule="nonzero" x="5" y="0"
								      width="500" height="120" rx="8"></rect>
								<text id="中间层-title" fill="#008000" fontFamily="PingFangSC-Semibold, PingFang SC" fontSize="18"
								      fontWeight="500">
									<tspan x="29" y="34">{t('middleLayer')}</tspan>
								</text>
								<text id="--连接南向和北向，知识聚合与分发" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="32" y="74">-</tspan>
									<tspan x="40.5517578" y="74"
									       fontFamily="PingFangSC-Regular, PingFang SC">{t('connect')}</tspan>
								</text>
								<text id="--支持问答、DevOps任务协同" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="32" y="99">-</tspan>
									<tspan x="40.5517578" y="99" fontFamily="PingFangSC-Regular, PingFang SC">{t('qaDevops')}</tspan>
								</text>
								{/* Clickable Knowledge Hub Area */}
								<g onClick={() => handleSectionClick('knowledge-hub')} style={clickableStyle}>
									<rect id="Rectangle-knowledgehub" stroke="#008000" fillOpacity="0.2" fill="#008000" fillRule="nonzero" x="340" y="35" width="140" height="54" rx="5"></rect>
									<text id="知识中枢-label" fill="#008000" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal">
										<tspan x="355" y="68">{t('knowledgeHub')}</tspan>
									</text>
								</g>
							</g>

							<g transform="translate(260.000000, 310.000000)" id="Arrow-2" stroke="#FFD700" strokeWidth="2">
								<path d="M10,0 L10,30 M0,20 L10,30 L20,20"></path>
							</g>

							{/* 内部接口 Section Container (no longer clickable itself) */}
							<g id="internal-interface-container" transform="translate(0.000000, 360.000000)">
								<rect id="Rectangle" stroke="#0000FF" strokeWidth="2" fill="#FFFFFF" fillRule="nonzero" x="5" y="0"
								      width="500" height="120" rx="8"></rect>
								<text id="内部接口-title" fill="#0000FF" fontFamily="PingFangSC-Semibold, PingFang SC" fontSize="18"
								      fontWeight="500">
									<tspan x="27" y="26">{t('internalApi')}</tspan>
								</text>
								<text id="--提供编辑器、代码库等内部-API" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="27" y="72">-</tspan>
									<tspan x="35.5517578" y="72" fontFamily="PingFangSC-Regular, PingFang SC">{t('editorApi')}</tspan>
								</text>
								<text id="--平台基础设施与数据处理能力" fill="#000000" fontFamily="Helvetica" fontSize="14"
								      fontWeight="normal">
									<tspan x="27" y="97">-</tspan>
									<tspan x="35.5517578" y="97" fontFamily="PingFangSC-Regular, PingFang SC">{t('infra')}</tspan>
								</text>
								{/* Clickable Platform API Area */}
								<g onClick={() => handleSectionClick('standard-api')} style={clickableStyle}>
									<rect id="Rectangle-platformapi" stroke="#0000FF" fillOpacity="0.2" fill="#0000FF" fillRule="nonzero" x="340" y="35" width="140" height="54" rx="5"></rect>
									<text id="平台-API-label" fill="#0000FF" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14" fontWeight="normal">
										<tspan x="355" y="68">{t('standardApi')}</tspan>
									</text>
								</g>
							</g>
						</g>

						<g id="ai-governance-container" transform="translate(-280.000000, 0.000000)">
							<rect stroke="#4B0082" strokeWidth="2" fill="#FFFFFF" width="250" height="480" rx="8" />
							<text fill="#4B0082" fontFamily="Helvetica-Bold, Helvetica" fontSize="18" fontWeight="bold">
								<tspan x="57" y="40" fontFamily="PingFangSC-Semibold, PingFang SC" fontWeight="500">{t('aiGovernance')}</tspan>
							</text>
							<line x1="75" y1="50" x2="175" y2="50" stroke="#4B0082" strokeWidth="2" />
							<g transform="translate(32, 78)">
								<text fill="#000000" fontFamily="Helvetica" fontSize="14">
									<tspan x="0" y="14">- </tspan>
									<tspan x="8.5" y="14" fontFamily="PingFangSC-Regular, PingFang SC">{t('governanceStrategy')}</tspan>
									<tspan x="0" y="54">- </tspan>
									<tspan x="8.5" y="54" fontFamily="PingFangSC-Regular, PingFang SC">{t('permission')}</tspan>
									<tspan x="0" y="94">- </tspan>
									<tspan x="8.5" y="94" fontFamily="PingFangSC-Regular, PingFang SC">{t('contextInject')}</tspan>
									<tspan x="0" y="134">- </tspan>
									<tspan x="8.5" y="134" fontFamily="PingFangSC-Regular, PingFang SC">{t('audit')}</tspan>
									<tspan x="0" y="174">- </tspan>
									<tspan x="8.5" y="174" fontFamily="PingFangSC-Regular, PingFang SC">{t('resource')}</tspan>
								</text>
								<g onClick={() => handleSectionClick('idp-governance')} style={clickableStyle}>
									<rect stroke="#4B0082" fillOpacity="0.2" fill="#4B0082" x="8" y="323" width="188" height="54" rx="5" />
									<text fill="#4B0082" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14">
										<tspan x="35" y="353">{t('idp')}</tspan>
									</text>
								</g>
							</g>
						</g>

						<g id="ai-metrics-container" transform="translate(540.000000, 0.000000)">
							<rect stroke="#2E8B57" strokeWidth="2" fill="#FFFFFF" width="250" height="480" rx="8" />
							<text fill="#2E8B57" fontFamily="Helvetica-Bold, Helvetica" fontSize="18" fontWeight="bold">
								<tspan x="40" y="40">{t('aiMetrics')}</tspan>
							</text>
							<line x1="30" y1="50" x2="220" y2="50" stroke="#2E8B57" strokeWidth="2" />
							<g transform="translate(20, 78)">
								<text fill="#000000" fontFamily="Helvetica" fontSize="14">
									<tspan x="0" y="14">- {t('modelEval')}</tspan>
									<tspan x="0" y="54">- {t('response')}</tspan>
									<tspan x="0" y="94">- {t('usage')}</tspan>
									<tspan x="0" y="134">- {t('productivity')}</tspan>
								</text>
								<g onClick={() => handleSectionClick('ai-metrics')} style={clickableStyle}>
									<rect stroke="#2E8B57" fillOpacity="0.2" fill="#2E8B57" x="0" y="323" width="210" height="54" rx="5" />
									<text fill="#2E8B57" fontFamily="PingFangSC-Regular, PingFang SC" fontSize="14">
										<tspan x="45" y="353">{t('improve')}</tspan>
									</text>
								</g>
							</g>
						</g>
					</g>
				</g>
			</svg>
		</div>
	)
} 