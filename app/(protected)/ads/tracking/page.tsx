import dynamic from 'next/dynamic';

const Tracking = dynamic(() => import('@/pages/ads/Tracking'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Tracking />;
}