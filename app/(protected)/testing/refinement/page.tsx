import dynamic from 'next/dynamic';

const Refinement = dynamic(() => import('@/pages/testing/Refinement'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <Refinement />;
}