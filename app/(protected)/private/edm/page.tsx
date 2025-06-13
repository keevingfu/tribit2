import dynamic from 'next/dynamic';

const EDM = dynamic(() => import('@/pages/private/EDM'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <EDM />;
}