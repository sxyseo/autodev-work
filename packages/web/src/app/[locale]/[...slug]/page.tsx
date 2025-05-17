'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// 动态组件加载函数
const loadDynamicComponent = (path: string) => {
  // 这里尝试加载对应的页面组件
  try {
    // 移除尾部的斜杠
    const normalizedPath = path.replace(/\/$/, '');
    // 尝试动态加载对应的页面组件
    return dynamic(() => import(`../../${normalizedPath}/page`), {
      loading: () => <div className="p-8">加载中...</div>,
      ssr: false, // 禁用SSR可以避免一些导入问题
    });
  } catch (error) {
    console.error(`无法加载组件: ../../${path}/page`, error);
    return null;
  }
};

export default function CatchAllPage() {
  const params = useParams();
  const t = useTranslations();
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      setLoading(true);
      try {
        // 获取slug参数
        const slugArray = Array.isArray(params.slug) 
          ? params.slug 
          : typeof params.slug === 'string' 
            ? [params.slug] 
            : [];
        
        // 将slug数组转换为路径
        const path = slugArray.join('/');
        
        // 动态导入组件
        const DynamicComponent = loadDynamicComponent(path);
        setComponent(() => DynamicComponent);
      } catch (err) {
        console.error('加载组件时出错:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    loadComponent();
  }, [params.slug]);

  if (loading) {
    return <div className="p-8 flex justify-center items-center min-h-[500px]">
      <div className="text-xl">加载中...</div>
    </div>;
  }

  if (error || !Component) {
    return notFound();
  }

  return <Component />;
} 