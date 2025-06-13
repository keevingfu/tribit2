import dynamic from 'next/dynamic';

const AdsDashboard = dynamic(() => import('@/components/ads/Dashboard/AdsDashboard'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ),
});

export default function AdsPage() {
  return <AdsDashboard />;
}