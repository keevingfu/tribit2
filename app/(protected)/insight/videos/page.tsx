import dynamic from 'next/dynamic';

const VideoInsights = dynamic(() => import('@/pages/insight/VideoInsights'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <VideoInsights />;
}