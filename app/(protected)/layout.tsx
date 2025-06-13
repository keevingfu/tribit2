import { Layout } from '@/components/common/Layout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}