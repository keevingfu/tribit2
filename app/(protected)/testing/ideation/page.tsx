import dynamic from 'next/dynamic';

const Ideation = dynamic(() => import('@/pages/testing/Ideation'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Ideation />;
}