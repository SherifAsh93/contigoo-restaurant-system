'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

interface LayoutProps {
  children: ReactNode;
  role: UserRole;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const ROLE_CONFIG = {
  owner: { 
    label: 'Owner Dashboard', 
    color: 'from-purple-600 to-purple-700', 
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: '👑',
    href: '/owner'
  },
  head_chef: { 
    label: 'Head Chef Dashboard', 
    color: 'from-red-600 to-red-700', 
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: '👨‍🍳',
    href: '/head-chef'
  },
  line_chef: { 
    label: 'Line Chef Station', 
    color: 'from-orange-600 to-orange-700', 
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: '🍳',
    href: '/line-chef'
  },
  sous_chef: { 
    label: 'Sous Chef Dashboard', 
    color: 'from-amber-600 to-amber-700', 
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: '👨‍🍳',
    href: '/sous-chef'
  },
  server: { 
    label: 'Server Dashboard', 
    color: 'from-blue-600 to-blue-700', 
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: '🍽️',
    href: '/server'
  },
  customer: { 
    label: 'Customer Portal', 
    color: 'from-green-600 to-green-700', 
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: '🍴',
    href: '/customer'
  },
};

export function RoleLayout({ children, role, title, subtitle, actions }: LayoutProps) {
  const pathname = usePathname();
  const config = ROLE_CONFIG[role];
  const { currentUser, logout } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className={`bg-gradient-to-r ${config.color} text-white shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <h1 className="text-xl font-bold">{config.label}</h1>
                {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {actions}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs opacity-70">Logged in as</p>
                  <p className="font-medium">{currentUser?.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs for Owner */}
      {role === 'owner' && (
        <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto">
              {[
                { href: '/owner', label: 'Overview', icon: '📊' },
                { href: '/owner/orders', label: 'All Orders', icon: '📋' },
                { href: '/owner/kitchen', label: 'Kitchen', icon: '🍳' },
                { href: '/owner/staff', label: 'Staff', icon: '👥' },
                { href: '/owner/reports', label: 'Reports', icon: '📈' },
                { href: '/owner/menu', label: 'Menu', icon: '📖' },
                { href: '/owner/settings', label: 'Settings', icon: '⚙️' },
              ].map(tab => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                    pathname === tab.href || (tab.href !== '/owner' && pathname.startsWith(tab.href))
                      ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Page Title Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}