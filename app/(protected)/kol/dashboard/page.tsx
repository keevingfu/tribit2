import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('@/pages/kol/DashboardPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <DashboardPage />;
}