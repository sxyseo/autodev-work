"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Book, Network, Plus, Loader2, Check, Info, Tag, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import KnowledgeGraphPopup from "./knowledge-graph-popup"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ConceptDictionary {
  id: string
  termChinese: string
  termEnglish: string
  descChinese: string
  descEnglish: string
  projectId: string | null
  createdAt: string
  updatedAt: string
}

interface Guideline {
  id: string
  title: string
  description: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  category: any
  content: string
  language: string
  version: string
  lastUpdated: string
  popularity: number
  status: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface KnowledgeHubProps {
  activeSource: string | null
  onSourceSelect: (sourceId: string | null) => void
  projectId?: string // 可选的项目ID参数
  extractedKeywords?: string[] // 添加新属性
}

export default function KnowledgeHub({
  activeSource,
  onSourceSelect,
  projectId,
  extractedKeywords = []
}: KnowledgeHubProps) {
  const t = useTranslations('cockpit.knowledge');
  const [showKnowledgeGraphPopup, setShowKnowledgeGraphPopup] = useState(false)
  const [glossaryTerms, setGlossaryTerms] = useState<ConceptDictionary[]>([])
  const [isLoadingGlossary, setIsLoadingGlossary] = useState(false)
  const [glossaryError, setGlossaryError] = useState<string | null>(null)
  const [guidelines, setGuidelines] = useState<Guideline[]>([])
  const [isLoadingGuidelines, setIsLoadingGuidelines] = useState(false)
  const [guidelinesError, setGuidelinesError] = useState<string | null>(null)
  const [selectedGuidelines, setSelectedGuidelines] = useState<string[]>([])
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([])
  const [isValidatingKeywords, setIsValidatingKeywords] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [validationResults, setValidationResults] = useState<any>(null)
  // 添加新状态跟踪AI验证的匹配词
  const [aiVerifiedMatches, setAiVerifiedMatches] = useState<string[]>([])

  useEffect(() => {
    async function fetchGlossaryTerms() {
      setIsLoadingGlossary(true)
      setGlossaryError(null)
      try {
        let url = '/api/concepts/dict';

        // 如果提供了项目ID，则获取特定项目的词汇表
        if (projectId) {
          url = `/api/concepts/dict/${projectId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(t('errors.fetchGlossaryFailed'));
        }

        const data = await response.json();
        setGlossaryTerms(data);
      } catch (error) {
        console.error(t('errors.fetchGlossaryError'), error);
        setGlossaryError(error instanceof Error ? error.message : t('errors.unknownError'));
      } finally {
        setIsLoadingGlossary(false);
      }
    }

    async function fetchGuidelines() {
      setIsLoadingGuidelines(true)
      setGuidelinesError(null)
      try {
        const response = await fetch('/api/guideline');

        if (!response.ok) {
          throw new Error(t('errors.fetchGuidelinesFailed'));
        }

        const data = await response.json();
        setGuidelines(data);
      } catch (error) {
        console.error(t('errors.fetchGuidelinesError'), error);
        setGuidelinesError(error instanceof Error ? error.message : t('errors.unknownError'));
      } finally {
        setIsLoadingGuidelines(false);
      }
    }

    fetchGlossaryTerms();
    fetchGuidelines();
  }, [projectId, t]);

  useEffect(() => {
    if (extractedKeywords.length > 0 && glossaryTerms.length > 0) {
      // 找出匹配或相似的关键词
      const matched = extractedKeywords.filter(keyword =>
        glossaryTerms.some(term =>
          term.termChinese.toLowerCase().includes(keyword.toLowerCase()) ||
          term.termEnglish.toLowerCase().includes(keyword.toLowerCase()) ||
          keyword.toLowerCase().includes(term.termChinese.toLowerCase()) ||
          keyword.toLowerCase().includes(term.termEnglish.toLowerCase())
        )
      );
      setMatchedKeywords(matched);
    } else {
      setMatchedKeywords([]);
    }
  }, [extractedKeywords, glossaryTerms]);

  const validateKeywordsWithLLM = async () => {
    if (extractedKeywords.length === 0) return;

    setIsValidatingKeywords(true);
    setValidationResults(null);

    try {
      const response = await fetch('/api/validate-concepts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concepts: extractedKeywords,
          codeContext: glossaryTerms.map(term => `${term.termChinese}(${term.termEnglish}): ${term.descChinese}`).join('\n')
        }),
      });

      if (!response.ok) {
        throw new Error(t('errors.validateKeywordsFailed'));
      }

      const data = await response.json();

      // 更新验证结果
      setValidationResults(data);

      // 如果验证成功且返回了匹配项，更新AI验证的匹配词
      if (data.success && data.matches && Array.isArray(data.matches)) {
        setAiVerifiedMatches(data.matches);
      } else {
        // 如果没有返回匹配项但验证成功，使用原始匹配作为AI验证的匹配
        setAiVerifiedMatches(matchedKeywords);
      }
    } catch (error) {
      console.error(t('errors.validateKeywordsError'), error);
      setValidationResults({
        success: false,
        message: t('validation.failed'),
        error: error instanceof Error ? error.message : t('errors.unknownError')
      });
      // 验证失败时清空AI验证的匹配词
      setAiVerifiedMatches([]);
    } finally {
      setIsValidatingKeywords(false);
    }
  };

  const getItemTypeIcon = (category: string) => {
    // check category is string if not return with type
    if (typeof category !== "string") {
      return <FileText className="h-3 w-3 mr-1 text-blue-600" />;
    }

    if (category?.includes("document")) return <FileText className="h-3 w-3 mr-1 text-blue-600" />;
    if (category?.includes("standard")) return <Book className="h-3 w-3 mr-1 text-purple-600" />;
    return <FileText className="h-3 w-3 mr-1 text-blue-600" />;
  };

  const toggleGuidelineSelection = (guidelineId: string) => {
    setSelectedGuidelines(prev =>
      prev.includes(guidelineId)
        ? prev.filter(id => id !== guidelineId)
        : [...prev, guidelineId]
    );
  };

  const getMatchingTermForKeyword = (keyword: string) => {
    return glossaryTerms.find(term =>
      term.termChinese.toLowerCase().includes(keyword.toLowerCase()) ||
      term.termEnglish.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termChinese.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termEnglish.toLowerCase())
    );
  };

  // 添加检查词汇表条目是否与关键词匹配的函数
  const isTermMatchingAnyKeyword = (term: ConceptDictionary) => {
    if (extractedKeywords.length === 0) return false;

    return extractedKeywords.some(keyword =>
      term.termChinese.toLowerCase().includes(keyword.toLowerCase()) ||
      term.termEnglish.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termChinese.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termEnglish.toLowerCase())
    );
  };

  // 获取词汇表条目匹配的关键词
  const getMatchingKeywordsForTerm = (term: ConceptDictionary) => {
    return extractedKeywords.filter(keyword =>
      term.termChinese.toLowerCase().includes(keyword.toLowerCase()) ||
      term.termEnglish.toLowerCase().includes(keyword.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termChinese.toLowerCase()) ||
      keyword.toLowerCase().includes(term.termEnglish.toLowerCase())
    );
  };

  const implicitKnowledge = [
    {
      id: "code-insight-1",
      title: "从代码库分析",
      source: "会议室预订API",
      insight: "检测到现有API支持按部门筛选会议室，新系统可能需要保持此功能",
    }
  ]

  // 修改关键词匹配判断逻辑
  const isKeywordMatched = (keyword: string) => {
    return matchedKeywords.includes(keyword);
  };

  // 添加AI验证匹配判断逻辑
  const isKeywordAiVerified = (keyword: string) => {
    return aiVerifiedMatches.includes(keyword) && validationResults?.success;
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-4 py-2 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{t('title')}</h2>
        <p className="text-xs text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="flex-1 flex flex-col">
        {/* 显性知识部分 */}
        <div className="border-b border-gray-200">
          <div className="px-4 py-2 flex justify-between items-center border-b">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-semibold text-gray-700">{t('explicit.title')}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400">
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{t('tooltip.development')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              {selectedGuidelines.length > 0 && (
                <Button variant="outline" size="sm" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  {t('buttons.applySelected', { count: selectedGuidelines.length })}
                </Button>
              )}
              <Button variant="outline" size="sm" className="text-xs">
                <Upload className="h-3 w-3 mr-1" />
                {t('buttons.uploadDoc')}
              </Button>
            </div>
          </div>

          <ScrollArea className="h-48">
            <div className="p-2 space-y-2">
              {isLoadingGuidelines ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              ) : guidelinesError ? (
                <div className="text-xs text-red-500 p-2">
                  {t('errors.guidelinesError')}: {guidelinesError}
                </div>
              ) : guidelines.length === 0 ? (
                <div className="text-xs text-gray-500 p-2">
                  {t('empty.guidelines')}
                </div>
              ) : (
                guidelines.map((guideline) => (
                  <Card
                    key={guideline.id}
                    className={cn(
                      "cursor-pointer hover:border-blue-200 transition-colors py-0 gap-0",
                      activeSource === guideline.id && "border-blue-500 bg-blue-50",
                    )}
                  >
                    <CardHeader className="px-4 py-2 pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`guideline-${guideline.id}`}
                            checked={selectedGuidelines.includes(guideline.id)}
                            onCheckedChange={() => toggleGuidelineSelection(guideline.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <CardTitle
                            className="text-sm font-medium flex items-center"
                            onClick={() => onSourceSelect(guideline.id === activeSource ? null : guideline.id)}
                          >
                            {getItemTypeIcon(guideline.category)}
                            {guideline.title}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="text-[10px] h-4">
                          {guideline.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent
                      className="p-2"
                      onClick={() => onSourceSelect(guideline.id === activeSource ? null : guideline.id)}
                    >
                      <p className="text-xs text-gray-600">{guideline.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{t('labels.updated')}: {guideline.lastUpdated}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div>
          <div className="px-4 py-2 border-b">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-semibold text-gray-700">{t('implicit.title')}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400">
                      <Info className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{t('tooltip.development')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <ScrollArea className="h-48">
            <div className="p-2 space-y-2">
              {implicitKnowledge.map((item) => (
                <Card key={item.id} className="cursor-pointer hover:border-blue-200 transition-colors py-0 gap-0">
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] h-4 w-fit">
                      {t('labels.source')}: {item.source}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-3 pt-2">
                    <p className="text-xs text-gray-600">{item.insight}</p>
                    <div className="flex justify-end mt-1 gap-1">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                        {t('buttons.confirm')}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px]">
                        {t('buttons.markRelated')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* 修改提取的关键词部分 */}
      {extractedKeywords.length > 0 && (
        <div className="border-t border-gray-200 p-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">{t('keywords.title')}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-gray-400">
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t('tooltip.autoExtract')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {extractedKeywords.map((keyword, index) => {
              const isMatched = isKeywordMatched(keyword);
              const isAiVerified = isKeywordAiVerified(keyword);
              const matchingTerm = isMatched ? getMatchingTermForKeyword(keyword) : null;

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={isAiVerified && matchingTerm?.termChinese ? "default" : isMatched ? "outline" : "secondary"}
                        className={`flex items-center gap-1 cursor-help ${
                          isAiVerified && matchingTerm?.termChinese
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300" 
                            : isMatched 
                              ? "bg-green-50 text-green-800 hover:bg-green-100 border-green-300" 
                              : ""
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        {keyword}
                        {isAiVerified && matchingTerm?.termChinese
                          ? <AlertCircle className="h-3 w-3 ml-1 text-purple-600" />
                          : isMatched
                            ? <Check className="h-3 w-3 ml-1 text-green-600" />
                            : null
                        }
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isAiVerified && matchingTerm?.termChinese ? (
                        <div className="text-xs max-w-60">
                          <p className="font-medium text-purple-800">{t('tooltip.aiVerified')}:</p>
                          <p>{matchingTerm?.termChinese} ({matchingTerm?.termEnglish})</p>
                          <p className="text-gray-500 mt-1">{matchingTerm?.descChinese}</p>
                        </div>
                      ) : isMatched ? (
                        <div className="text-xs max-w-60">
                          <p className="font-medium">{t('tooltip.matched')}:</p>
                          <p>{matchingTerm?.termChinese} ({matchingTerm?.termEnglish})</p>
                          <p className="text-gray-500 mt-1">{matchingTerm?.descChinese}</p>
                        </div>
                      ) : (
                        <p className="text-xs">{t('tooltip.noMatch')}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={validateKeywordsWithLLM}
              disabled={isValidatingKeywords || extractedKeywords.length === 0}
            >
              {isValidatingKeywords ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {t('buttons.validating')}
                </>
              ) : validationResults?.success ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  {t('buttons.revalidate')}
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t('buttons.smartValidate')}
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              {t('buttons.addToGlossary')}
            </Button>
          </div>

          {validationResults && (
            <div className="mt-2 p-2 border rounded bg-gray-50 text-xs">
              <div className="font-medium mb-1">{t('validation.title')}:</div>
              <div className={validationResults.success ? "text-green-600" : "text-red-600"}>
                {validationResults.message || t('validation.complete')}
              </div>
              {validationResults.suggestions && (
                <div className="mt-1">
                  <span className="font-medium">{t('validation.suggestions')}:</span> {validationResults.suggestions}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 项目词汇表部分 - 确保未匹配项保持原始颜色 */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">{t('glossary.title')}</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <ScrollArea className="h-48">
          {isLoadingGlossary ? (
            <div className="flex justify-center items-center h-20">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          ) : glossaryError ? (
            <div className="text-xs text-red-500 p-2">
              {t('errors.glossaryError')}: {glossaryError}
            </div>
          ) : glossaryTerms.length === 0 ? (
            <div className="text-xs text-gray-500 p-2">
              {t('empty.glossary')}
            </div>
          ) : (
            <div className="space-y-1">
              {glossaryTerms.map((item) => {
                const isMatched = isTermMatchingAnyKeyword(item);
                const matchingKeywords = isMatched ? getMatchingKeywordsForTerm(item) : [];

                // 判断是否有任何关键词经过AI验证并匹配
                const isAiVerified = matchingKeywords.some(keyword => isKeywordAiVerified(keyword));

                return (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`text-xs p-1.5 rounded-md ${
                            isAiVerified 
                              ? "bg-purple-50 border border-purple-100" 
                              : isMatched 
                                ? "bg-green-50 border border-green-100" 
                                : ""
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className={`font-medium ${
                              isAiVerified 
                                ? "text-purple-800" 
                                : isMatched 
                                  ? "text-green-800" 
                                  : "text-gray-800"
                            }`}>
                              {item.termChinese}
                            </span>
                            <span className="text-gray-400">({item.termEnglish})</span>
                            {isAiVerified ? (
                              <AlertCircle className="h-3 w-3 text-purple-600" />
                            ) : isMatched ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : null}
                            <span className="text-gray-500"> - {item.descChinese}</span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      {(isMatched || isAiVerified) && (
                        <TooltipContent>
                          <div className="text-xs max-w-60">
                            <p className={`font-medium ${isAiVerified ? "text-purple-800" : ""}`}>
                              {isAiVerified ? t('tooltip.aiVerifiedMatch') : t('tooltip.matchedKeywords')}:
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {matchingKeywords.map((keyword, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className={isKeywordAiVerified(keyword)
                                    ? "bg-purple-50 text-purple-800 border-purple-300"
                                    : "bg-green-50 text-green-800 border-green-300"
                                  }
                                >
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border-t border-gray-200 p-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">{t('graph.title')}</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px]"
            onClick={() => setShowKnowledgeGraphPopup(true)}
          >
            <Network className="h-3 w-3 mr-1" />
            {t('buttons.view')}
          </Button>
        </div>
      </div>

      {showKnowledgeGraphPopup && (
        <KnowledgeGraphPopup onClose={() => setShowKnowledgeGraphPopup(false)} />
      )}
    </div>
  )
}

