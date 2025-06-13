import dynamic from 'next/dynamic';

const Optimization = dynamic(() => import('@/pages/ads/Optimization'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <Optimization />;
}