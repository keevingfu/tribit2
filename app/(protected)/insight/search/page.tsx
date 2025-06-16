import dynamic from 'next/dynamic';

const SearchInsights = dynamic(() => import('@/pages/insight/SearchInsights'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <SearchInsights />;
}