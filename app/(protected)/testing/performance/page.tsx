import dynamic from 'next/dynamic';

const Performance = dynamic(() => import('@/pages/testing/Performance'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Performance />;
}