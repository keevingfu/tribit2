import dynamic from 'next/dynamic';

const Audience = dynamic(() => import('@/pages/ads/Audience'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <Audience />;
}