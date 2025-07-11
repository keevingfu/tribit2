import dynamic from 'next/dynamic';

const Execution = dynamic(() => import('@/pages/testing/Execution'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Execution />;
}