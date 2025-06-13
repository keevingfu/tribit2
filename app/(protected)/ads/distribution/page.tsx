import dynamic from 'next/dynamic';

const Distribution = dynamic(() => import('@/pages/ads/Distribution'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <Distribution />;
}