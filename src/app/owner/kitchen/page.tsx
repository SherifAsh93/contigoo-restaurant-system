'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chef } from '@/types';

export default function OwnerKitchenPage() {
  const { orders, chefs, updateOrderItemStatus, assignChefToItem, getAvailableChefsForCategory } = useApp();
  const [selectedChef, setSelectedChef] = useState<string>('all');

  const handleAction = (order: any, action: string, itemId?: string) => {
    const item = order.items.find((i: any) => i.id === itemId);
    if (!item) return;

    switch (action) {
      case 'assign':
        const available = getAvailableChefsForCategory(item.menuItem.category);
        if (available.length > 0) {
          assignChefToItem(order.id, itemId!, available[0].id);
        }
        break;
      case 'start_cooking':
        updateOrderItemStatus(order.id, itemId!, 'cooking');
        break;
      case 'mark_cooked':
        updateOrderItemStatus(order.id, itemId!, 'cooked');
        break;
      case 'mark_prepared':
        updateOrderItemStatus(order.id, itemId!, 'prepared');
        break;
    }
  };

  const filteredOrders = selectedChef === 'all' 
    ? orders 
    : orders.filter(o => o.items.some(i => i.assignedChefId === selectedChef));

  return (
    <RoleLayout role="owner" title="Kitchen Management" subtitle="Monitor and manage kitchen operations">
      {/* Chef Filter */}
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="font-medium text-gray-700">Filter by Chef:</label>
          <select
            value={selectedChef}
            onChange={e => setSelectedChef(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Chefs</option>
            {chefs.map(chef => (
              <option key={chef.id} value={chef.id}>{chef.name} ({chef.activeOrders}/{chef.maxConcurrentOrders})</option>
            ))}
          </select>
          
          <div className="flex-1"></div>
          
          <div className="flex gap-4">
            {chefs.map(chef => (
              <div key={chef.id} className={`px-3 py-1 rounded-lg text-xs font-medium ${
                chef.activeOrders >= chef.maxConcurrentOrders ? 'bg-red-100 text-red-700' :
                chef.activeOrders > 0 ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {chef.name}: {chef.activeOrders}/{chef.maxConcurrentOrders}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Kitchen Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <Card variant="elevated" padding="md">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="warning" size="sm">Pending</Badge>
            <span>Unassigned Orders</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.filter(o => o.status === 'pending').map(order => (
              <OrderCard key={order.id} order={order} variant="kitchen" onAction={handleAction} />
            ))}
          </div>
        </Card>

        {/* Cooking */}
        <Card variant="elevated" padding="md">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="primary" size="sm">Cooking</Badge>
            <span>In Progress</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.filter(o => o.status === 'cooking' || o.status === 'assigned').map(order => (
              <OrderCard key={order.id} order={order} variant="kitchen" onAction={handleAction} />
            ))}
          </div>
        </Card>

        {/* Ready */}
        <Card variant="elevated" padding="md">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Badge variant="success" size="sm">Ready</Badge>
            <span>For Pickup</span>
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {orders.filter(o => o.status === 'cooked' || o.status === 'prepared').map(order => (
              <OrderCard key={order.id} order={order} variant="kitchen" onAction={handleAction} />
            ))}
          </div>
        </Card>
      </div>
    </RoleLayout>
  );
}