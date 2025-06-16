import dynamic from 'next/dynamic';

const Refinement = dynamic(() => import('@/pages/testing/Refinement'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function Page() {
  return <Refinement />;
}