import dynamic from 'next/dynamic';

const OverviewPage = dynamic(() => import('@/pages/kol/OverviewPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <OverviewPage />;
}