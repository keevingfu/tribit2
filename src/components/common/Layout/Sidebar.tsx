'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Users,
  TestTube,
  Megaphone,
  Lock,
  ChevronDown,
  ChevronRight,
  BarChart3,
  VideoIcon,
  TrendingUp,
  UserCheck,
  Share2,
  DollarSign,
  Mail,
  Linkedin,
  ShoppingBag,
  MessageSquare,
  Store,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['insight', 'kol']);

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: '�h�',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
    },
    {
      id: 'insight',
      title: '���',
      icon: <Search className="w-5 h-5" />,
      children: [
        {
          id: 'consumer-voice',
          title: '�9��',
          icon: <BarChart3 className="w-4 h-4" />,
          path: '/insight/consumer-voice',
        },
        {
          id: 'search-insights',
          title: '"�',
          icon: <Search className="w-4 h-4" />,
          path: '/insight/search',
        },
        {
          id: 'viral-videos',
          title: '>Ƒ',
          icon: <VideoIcon className="w-4 h-4" />,
          path: '/insight/videos',
        },
        {
          id: 'viral-analysis',
          title: '>�',
          icon: <TrendingUp className="w-4 h-4" />,
          path: '/insight/viral',
        },
      ],
    },
    {
      id: 'testing',
      title: '��K�',
      icon: <TestTube className="w-5 h-5" />,
      path: '/testing',
    },
    {
      id: 'kol',
      title: 'KOL��',
      icon: <Users className="w-5 h-5" />,
      children: [
        {
          id: 'kol-dashboard',
          title: ';�',
          icon: <LayoutDashboard className="w-4 h-4" />,
          path: '/kol/dashboard',
        },
        {
          id: 'kol-overview',
          title: 'KOL��',
          icon: <UserCheck className="w-4 h-4" />,
          path: '/kol/overview',
        },
        {
          id: 'kol-reach',
          title: ' ��',
          icon: <Share2 className="w-4 h-4" />,
          path: '/kol/reach',
        },
        {
          id: 'kol-conversion',
          title: 'l�',
          icon: <DollarSign className="w-4 h-4" />,
          path: '/kol/conversion',
        },
      ],
    },
    {
      id: 'ads',
      title: 'J��',
      icon: <Megaphone className="w-5 h-5" />,
      path: '/ads',
    },
    {
      id: 'private',
      title: '�߅�',
      icon: <Lock className="w-5 h-5" />,
      children: [
        {
          id: 'edm',
          title: 'EDM',
          icon: <Mail className="w-4 h-4" />,
          path: '/private/edm',
        },
        {
          id: 'linkedin',
          title: 'LinkedIn',
          icon: <Linkedin className="w-4 h-4" />,
          path: '/private/linkedin',
        },
        {
          id: 'shopify',
          title: 'Shopify',
          icon: <ShoppingBag className="w-4 h-4" />,
          path: '/private/shopify',
        },
        {
          id: 'whatsapp',
          title: 'WhatsApp',
          icon: <MessageSquare className="w-4 h-4" />,
          path: '/private/whatsapp',
        },
        {
          id: 'offline',
          title: '��',
          icon: <Store className="w-4 h-4" />,
          path: '/private/offline',
        },
      ],
    },
  ];

  const toggleExpand = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const pathname = usePathname();

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpand(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              level > 0 ? 'pl-8' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
            </div>
            {!isCollapsed && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )
            )}
          </button>
          {isExpanded && !isCollapsed && item.children && (
            <div className="bg-gray-50">
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === item.path;

    return (
      <Link
        key={item.id}
        href={(item.path || '#') as any}
        className={`flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
          isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
        } ${level > 0 ? 'pl-12' : ''}`}
      >
        {item.icon}
        {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        {isCollapsed ? (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">B</span>
          </div>
        ) : (
          <h1 className="text-xl font-bold text-blue-600">BuAgent</h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="overflow-y-auto h-[calc(100%-4rem)]">
        <div className="py-4">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;