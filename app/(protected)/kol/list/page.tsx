import dynamic from 'next/dynamic';

const ListPage = dynamic(() => import('@/pages/kol/ListPage'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

const KOLLayout = dynamic(() => import('@/pages/kol/KOLLayout'), {
  ssr: false,
});

export default function Page() {
  return (
    <KOLLayout>
      <ListPage />
    </KOLLayout>
  );
}