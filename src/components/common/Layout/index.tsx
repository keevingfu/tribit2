'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { 
  LayoutDashboard, 
  Search, 
  TestTube2, 
  Users, 
  Megaphone, 
  Lock,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: '仪表板',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: '内容洞察',
    icon: Search,
    href: '/insight',
    children: [
      { title: '搜索洞察', href: '/insight/search' },
      { title: '消费者之声', href: '/insight/consumer-voice' },
      { title: '视频洞察', href: '/insight/videos' },
      { title: '病毒式分析', href: '/insight/viral-analysis' },
    ],
  },
  {
    title: '内容测试',
    icon: TestTube2,
    href: '/testing',
    children: [
      { title: '创意构思', href: '/testing/ideation' },
      { title: '测试执行', href: '/testing/execution' },
      { title: '性能分析', href: '/testing/performance' },
      { title: '优化改进', href: '/testing/refinement' },
    ],
  },
  {
    title: 'KOL管理',
    icon: Users,
    href: '/kol',
    children: [
      { title: 'KOL仪表板', href: '/kol/dashboard' },
      { title: 'KOL概览', href: '/kol/overview' },
      { title: '转化分析', href: '/kol/conversion' },
    ],
  },
  {
    title: '广告管理',
    icon: Megaphone,
    href: '/ads',
    children: [
      { title: '受众分析', href: '/ads/audience' },
      { title: '渠道分布', href: '/ads/distribution' },
      { title: '优化建议', href: '/ads/optimization' },
      { title: '效果追踪', href: '/ads/tracking' },
    ],
  },
  {
    title: '私域分析',
    icon: Lock,
    href: '/private',
    children: [
      { title: 'EDM分析', href: '/private/edm' },
      { title: 'LinkedIn', href: '/private/linkedin' },
      { title: 'Shopify', href: '/private/shopify' },
      { title: 'WhatsApp', href: '/private/whatsapp' },
      { title: '线下门店', href: '/private/offline-stores' },
    ],
  },
];

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleExpanded = (href: string) => {
    setExpandedItems(prev =>
      prev.includes(href)
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  React.useEffect(() => {
    // Auto-expand current section
    const currentSection = menuItems.find(item =>
      pathname?.startsWith(item.href)
    );
    if (currentSection && currentSection.children) {
      setExpandedItems([currentSection.href]);
    }
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Tribit Platform</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const isExpanded = expandedItems.includes(item.href);

              return (
                <div key={item.href} className="mb-1">
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.href)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3" />
                          {item.title}
                        </div>
                        <svg
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="mt-1 ml-8">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href as any}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === child.href
                                  ? 'bg-blue-50 text-blue-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href as any}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              退出登录
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}