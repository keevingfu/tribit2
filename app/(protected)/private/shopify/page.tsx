import dynamic from 'next/dynamic';

const Shopify = dynamic(() => import('@/pages/private/Shopify'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <Shopify />;
}