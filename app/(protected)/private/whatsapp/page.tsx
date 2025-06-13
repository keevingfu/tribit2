import dynamic from 'next/dynamic';

const WhatsApp = dynamic(() => import('@/pages/private/WhatsApp'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">加载中...</div>
});

export default function Page() {
  return <WhatsApp />;
}