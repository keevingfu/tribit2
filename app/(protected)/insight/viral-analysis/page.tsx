import dynamic from 'next/dynamic';

const ViralAnalysis = dynamic(() => import('@/pages/insight/ViralAnalysis'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <ViralAnalysis />;
}