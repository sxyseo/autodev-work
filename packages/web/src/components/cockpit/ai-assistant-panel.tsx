"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, HelpCircle, Star } from "lucide-react"
import { useTranslations } from 'next-intl'

interface QualityAlert {
  id: string
  type: string
  message: string
  relatedReqId: string
}

interface AIAssistantPanelProps {
  qualityAlerts: QualityAlert[]
  onAlertClick: (reqId: string) => void
}

export default function AIAssistantPanel({ qualityAlerts, onAlertClick }: AIAssistantPanelProps) {
  const t = useTranslations('cockpit.assistant');
  
  const suggestions = [
    {
      id: "sug-1",
      content: "为了确保需求的完整性，您是否考虑过会议室预订冲突的处理方式？",
      confidence: 4,
    },
    {
      id: "sug-2",
      content: "我建议为预订功能添加一项非功能性需求：系统应在用户提交预订后5秒内发送确认通知。",
      confidence: 5,
    },
  ]

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{t('title')}</h2>
        <p className="text-xs text-gray-500">{t('subtitle')}</p>
      </div>

      {/* AI Questions & Suggestions */}
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('suggestions')}</h3>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="bg-blue-50 border-blue-200 py-0">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-gray-800">{suggestion.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < suggestion.confidence ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                            {t('buttons.ignore')}
                          </Button>
                          <Button size="sm" className="h-6 text-[10px]">
                            {t('buttons.accept')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">{t('quality')}</h3>
        <ScrollArea className="min-h-48">
          <div className="space-y-2">
            {qualityAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="border-amber-200 hover:bg-amber-50 cursor-pointer transition-colors py-0"
                onClick={() => onAlertClick(alert.relatedReqId)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-4 ${
                            alert.type === "ambiguity"
                              ? "border-amber-500 text-amber-700"
                              : alert.type === "testability"
                                ? "border-purple-500 text-purple-700"
                                : "border-red-500 text-red-700"
                          }`}
                        >
                          {alert.type === "ambiguity"
                            ? t('alerts.ambiguity')
                            : alert.type === "testability"
                              ? t('alerts.testability')
                              : alert.type === "inconsistency"
                                ? t('alerts.inconsistency')
                                : t('alerts.incompleteness')}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-800">{alert.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Core Operations */}
      {/*<div className="p-3 mt-auto border-t border-gray-200">*/}
      {/*  <h3 className="text-sm font-medium text-gray-700 mb-2">核心操作</h3>*/}
      {/*  <div className="grid grid-cols-2 gap-2">*/}
      {/*    <Button className="w-full text-xs justify-start">*/}
      {/*      <FileDown className="h-3 w-3 mr-1" />*/}
      {/*      生成需求文档*/}
      {/*    </Button>*/}
      {/*    <Button variant="outline" className="w-full text-xs justify-start">*/}
      {/*      <FileSearch className="h-3 w-3 mr-1" />*/}
      {/*      质量分析*/}
      {/*    </Button>*/}
      {/*    <Button variant="outline" className="w-full text-xs justify-start">*/}
      {/*      <CheckCircle className="h-3 w-3 mr-1" />*/}
      {/*      请求专家评审*/}
      {/*    </Button>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
