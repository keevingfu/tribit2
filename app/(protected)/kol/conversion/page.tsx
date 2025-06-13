import dynamic from 'next/dynamic';

const ConversionPage = dynamic(() => import('@/pages/kol/ConversionPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <ConversionPage />;
}