'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/lib/utils';

export default function ServerDashboardPage() {
  const { orders, currentUser, tables, updateOrderItemStatus, updateTable, getOrdersForRole } = useApp();
  const [view, setView] = useState<'ready' | 'delivering' | 'tables'>('ready');

  const myOrders = getOrdersForRole('server', currentUser?.id || '');
  
  const readyOrders = myOrders.filter(o => 
    o.items.some(i => i.status === 'prepared' || i.status === 'cooked')
  );

  const deliveringOrders = myOrders.filter(o => 
    o.items.some(i => i.status === 'delivering')
  );

  const completedOrders = myOrders.filter(o => 
    o.items.every(i => i.status === 'delivered' || i.status === 'completed')
  );

  const handleAction = (order: any, action: string, itemId?: string) => {
    switch (action) {
      case 'pickup':
        if (itemId) {
          updateOrderItemStatus(order.id, itemId!, 'delivering');
        }
        break;
      case 'mark_delivered':
        if (itemId) {
          updateOrderItemStatus(order.id, itemId!, 'delivered');
        }
        break;
    }
  };

  return (
    <RoleLayout 
      role="server" 
      title="Server Dashboard" 
      subtitle={currentUser ? `Welcome, ${currentUser.name}` : 'Order Delivery & Tables'}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setView('ready')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'ready' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'}`}
          >
            Ready to Pickup ({readyOrders.length})
          </button>
          <button
            onClick={() => setView('delivering')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'delivering' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'}`}
          >
            Delivering ({deliveringOrders.length})
          </button>
          <button
            onClick={() => setView('tables')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'tables' ? 'bg-white text-blue-600' : 'text-white/80 hover:text-white'}`}
          >
            Tables
          </button>
        </div>
      }
    >
      {view === 'ready' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Ready for Pickup</h3>
            <Badge variant={readyOrders.length > 0 ? 'success' : 'default'} size="md">
              {readyOrders.length} orders
            </Badge>
          </div>

          {readyOrders.length === 0 ? (
            <Card variant="outlined" padding="lg" className="text-center border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No orders ready</h3>
              <p className="text-gray-500">Orders marked as prepared will appear here for pickup</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {readyOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  variant="server" 
                  onAction={handleAction}
                  showServer={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'delivering' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Currently Delivering</h3>
            <Badge variant={deliveringOrders.length > 0 ? 'primary' : 'default'} size="md">
              {deliveringOrders.length} orders
            </Badge>
          </div>

          {deliveringOrders.length === 0 ? (
            <Card variant="outlined" padding="lg" className="text-center border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No active deliveries</h3>
              <p className="text-gray-500">Picked up orders will appear here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {deliveringOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  variant="server" 
                  onAction={handleAction}
                  showServer={true}
                />
              ))}
            </div>
          )}

          {completedOrders.length > 0 && (
            <Card variant="elevated" padding="md">
              <h3 className="font-bold text-gray-900 mb-3">Recently Delivered</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {completedOrders.slice(0, 5).map(order => (
                  <OrderCard key={order.id} order={order} variant="compact" />
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {view === 'tables' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Table Overview</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {tables.map(table => (
              <Card 
                key={table.id} 
                variant={table.status === 'occupied' ? 'elevated' : 'outlined'} 
                padding="lg"
                className={`text-center ${table.status === 'occupied' ? 'border-green-200 bg-green-50' : table.status === 'reserved' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${
                  table.status === 'occupied' ? 'bg-green-100 text-green-700' :
                  table.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {table.number}
                </div>
                <p className="text-sm text-gray-500 capitalize">{table.status}</p>
                {table.currentOrderId && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium">{table.currentOrderId}</p>
                    <Button variant="outline" size="sm" className="w-full mt-1">
                      View Order
                    </Button>
                  </div>
                )}
                {!table.currentOrderId && table.status === 'free' && (
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    New Order
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </RoleLayout>
  );
}