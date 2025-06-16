import dynamic from 'next/dynamic';

const Shopify = dynamic(() => import('@/pages/private/Shopify'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Shopify />;
}