'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chef } from '@/types';
import { getElapsedMinutes } from '@/lib/utils';

export default function HeadChefDashboardPage() {
  const { orders, chefs, currentUser } = useApp();
  const [view, setView] = useState<'overview' | 'stations'>('overview');

  const lineChefs = chefs.filter(c => c.chefRole === 'line_chef' || c.chefRole === 'sous_chef');

  return (
    <RoleLayout 
      role="head_chef" 
      title="Head Chef Dashboard" 
      subtitle={currentUser ? `Kitchen Commander — ${currentUser.name}` : 'Kitchen Command Center'}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setView('overview')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'overview' ? 'bg-white text-red-600' : 'text-white/80 hover:text-white'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setView('stations')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'stations' ? 'bg-white text-red-600' : 'text-white/80 hover:text-white'}`}
          >
            Stations
          </button>
        </div>
      }
    >
      <Card variant="elevated" padding="md" className="mb-6">
        <h3 className="font-bold text-gray-900">Kitchen Status</h3>
        <p className="text-gray-500">Head Chef dashboard - simplified version</p>
      </Card>
    </RoleLayout>
  );
}