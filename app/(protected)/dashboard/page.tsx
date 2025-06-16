import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with charts
const Dashboard = dynamic(() => import('@/pages/Dashboard'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function DashboardPage() {
  return <Dashboard />;
}