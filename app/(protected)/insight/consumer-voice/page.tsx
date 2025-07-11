import dynamic from 'next/dynamic';

const ConsumerVoice = dynamic(() => import('@/pages/insight/ConsumerVoice'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <ConsumerVoice />;
}