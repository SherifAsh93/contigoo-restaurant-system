'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chef } from '@/types';

export default function ChefDashboardPage() {
  const { orders, chefs, currentUser, updateOrderItemStatus, assignChefToItem, getAvailableChefsForCategory } = useApp();
  const [view, setView] = useState<'my-orders' | 'all-orders' | 'available'>('my-orders');

  const myOrders = orders.filter(order => 
    order.items.some(item => item.assignedChefId === currentUser?.id)
  );
  
  const unassignedOrders = orders.filter(order => 
    order.status === 'pending' && order.items.some(item => !item.assignedChefId)
  );

  const availableChefs = chefs.filter(c => c.id !== currentUser?.id);

  const handleAction = (order: any, action: string, itemId?: string) => {
    const item = order.items.find((i: any) => i.id === itemId);
    if (!item) return;

    switch (action) {
      case 'assign':
        assignChefToItem(order.id, itemId!, currentUser!.id);
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

  return (
    <RoleLayout 
      role="chef" 
      title="Kitchen Dashboard" 
      subtitle={currentUser ? `Welcome, ${currentUser.name}` : 'Kitchen Operations'}
      actions={
        <div className="flex gap-2">
          <button
            onClick={() => setView('my-orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'my-orders' ? 'bg-white text-orange-600' : 'text-white/80 hover:text-white'}`}
          >
            My Orders
          </button>
          <button
            onClick={() => setView('all-orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'all-orders' ? 'bg-white text-orange-600' : 'text-white/80 hover:text-white'}`}
          >
            All Kitchen
          </button>
          <button
            onClick={() => setView('available')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'available' ? 'bg-white text-orange-600' : 'text-white/80 hover:text-white'}`}
          >
            Available
          </button>
        </div>
      }
    >
      {view === 'my-orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">My Assigned Orders ({myOrders.length})</h3>
            <Badge variant={myOrders.length > 3 ? 'warning' : 'success'} size="md">
              {myOrders.length} active
            </Badge>
          </div>
          
          {myOrders.length === 0 ? (
            <Card variant="outlined" padding="lg" className="text-center border-2 border-dashed border-gray-300">
              <div className="text-4xl mb-4">🍳</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No assigned orders</h3>
              <p className="text-gray-500">Orders assigned to you will appear here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {myOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  variant="kitchen" 
                  onAction={handleAction}
                  showChef={true}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'all-orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">All Kitchen Orders</h3>
            <Badge variant="info" size="md">{orders.length} total</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending */}
            <Card variant="elevated" padding="md">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Badge variant="warning" size="sm">Pending</Badge>
                <span>Unassigned</span>
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unassignedOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending orders</p>
                ) : (
                  unassignedOrders.map(order => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      variant="kitchen" 
                      onAction={handleAction}
                    />
                  ))
                )}
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
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    variant="kitchen" 
                    onAction={handleAction}
                  />
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
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    variant="kitchen" 
                    onAction={handleAction}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {view === 'available' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Available Chefs</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableChefs.map(chef => (
              <Card key={chef.id} variant="elevated" padding="lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center text-2xl font-bold">
                    {chef.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{chef.name}</h4>
                    <p className="text-sm text-gray-500">{chef.specialties.join(', ')}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant={chef.activeOrders >= chef.maxConcurrentOrders ? 'danger' : 'success'} size="md">
                        {chef.activeOrders}/{chef.maxConcurrentOrders} orders
                      </Badge>
                      <Badge variant={chef.isAvailable ? 'success' : 'warning'} size="sm">
                        {chef.isAvailable ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </RoleLayout>
  );
}