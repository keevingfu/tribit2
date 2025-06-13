import dynamic from 'next/dynamic';

const LinkedIn = dynamic(() => import('@/pages/private/LinkedIn'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <LinkedIn />;
}