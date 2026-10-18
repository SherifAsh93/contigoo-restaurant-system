'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chef } from '@/types';
import { getElapsedMinutes } from '@/lib/utils';

export default function LineChefDashboardPage() {
  const { 
    orders, 
    chefs, 
    currentUser, 
    updateOrderItemStatus 
  } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'assigned' | 'cooking' | 'cooked'>('all');
  const [station, setStation] = useState<string>('');

  // Find this chef's info
  const myChefInfo = chefs.find(c => c.id === currentUser?.id);
  const myStation = myChefInfo?.station;

  // Get items assigned to this chef
  const myItems = orders.flatMap(order => 
    order.items
      .filter(item => item.assignedChefId === currentUser?.id)
      .map(item => ({ 
        ...item, 
        orderId: order.id, 
        orderNumber: order.orderNumber, 
        tableNumber: order.tableNumber, 
        customerName: order.customerName,
        status: item.status,
      }))
  );

  const assignedItems = myItems.filter(i => i.status === 'assigned');
  const cookingItems = myItems.filter(i => i.status === 'cooking');
  const cookedItems = myItems.filter(i => i.status === 'cooked' || i.status === 'prepared');
  const completedItems = myItems.filter(i => i.status === 'completed' || i.status === 'delivered');

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update timers
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (orderId: string, itemId: string, action: string) => {
    switch (action) {
      case 'start_cooking':
        updateOrderItemStatus(orderId, itemId, 'cooking');
        break;
      case 'mark_cooked':
        updateOrderItemStatus(orderId, itemId, 'cooked');
        break;
      case 'mark_prepared':
        updateOrderItemStatus(orderId, itemId, 'prepared');
        break;
    }
  };

  const filteredItems = selectedStatus === 'all' 
    ? myItems 
    : myItems.filter(i => i.status === selectedStatus);

  const stats = {
    assigned: assignedItems.length,
    cooking: cookingItems.length,
    cooked: cookedItems.length,
    completed: completedItems.length,
  };

  if (!myChefInfo) {
    return (
      <RoleLayout 
        role="line_chef" 
        title="Line Chef Station" 
        subtitle="Chef profile not found"
      >
        <div className="max-w-md mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-3">👨‍🍳</div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Chef profile not found</h3>
            <p className="text-gray-500">Contact the Head Chef to configure your station.</p>
          </div>
        </div>
      </RoleLayout>
    );
  }

  return (
    <RoleLayout 
      role="line_chef" 
      title="Line Chef Station" 
      subtitle={`${myChefInfo.name} • ${myStation?.toUpperCase() || 'Unassigned'} Station`}
      actions={
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            myChefInfo.activeOrders >= myChefInfo.maxConcurrentOrders ? 'bg-red-100 text-red-800' :
            myChefInfo.activeOrders > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {myChefInfo.activeOrders}/{myChefInfo.maxConcurrentOrders} Capacity
          </span>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online"></div>
        </div>
      }
    >
      {/* Station Header */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {myChefInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{myChefInfo.name}</h3>
                <p className="text-white/80 capitalize">{myStation} Station</p>
                <p className="text-white/60 text-sm">Specialties: {myChefInfo.specialties.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-right">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                myChefInfo.activeOrders >= myChefInfo.maxConcurrentOrders ? 'bg-red-100 text-red-800' :
                myChefInfo.activeOrders > 0 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {myChefInfo.activeOrders}/{myChefInfo.maxConcurrentOrders} Capacity
              </span>
              <div className="text-sm">
                {myChefInfo.isAvailable ? '🟢 Available' : '🔴 Busy'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Assigned" value={stats.assigned} color="blue" icon="📋" />
        <StatCard label="Cooking" value={stats.cooking} color="orange" icon="🔥" />
        <StatCard label="Cooked" value={stats.cooked} color="green" icon="✅" />
        <StatCard label="Done" value={stats.completed} color="purple" icon="🏁" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: `All (${myItems.length})`, color: 'gray' },
          { key: 'assigned', label: `Assigned (${assignedItems.length})`, color: 'blue' },
          { key: 'cooking', label: `Cooking (${cookingItems.length})`, color: 'orange' },
          { key: 'cooked', label: `Cooked/Ready (${cookedItems.length})`, color: 'green' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedStatus(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStatus === tab.key
                ? `bg-${tab.color}-600 text-white`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="text-4xl mb-3">
              {selectedStatus === 'assigned' ? '📋' : selectedStatus === 'cooking' ? '🔥' : selectedStatus === 'cooked' ? '✅' : '📭'}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {selectedStatus === 'all' 
                ? 'No orders assigned to you' 
                : `No ${selectedStatus} orders`}
            </h3>
            <p className="text-gray-500">
              {selectedStatus === 'assigned' 
                ? 'Wait for Head Chef to assign orders' 
                : selectedStatus === 'cooking' 
                  ? 'Start cooking your assigned orders' 
                  : 'Cooked items will appear here'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item, index) => (
              <OrderItemCard 
                key={`${item.orderId}-${item.id}`} 
                item={item} 
                onAction={handleAction}
                getElapsedMinutes={getElapsedMinutes}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Timer Reference */}
      <div className="mt-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4">⏱️ Station Target Times</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {myChefInfo.specialties.map(cat => {
            const times: Record<string, string> = {
              'mains': '15-25 min',
              'appetizers': '5-12 min',
              'desserts': '3-12 min',
              'specials': '20-30 min',
              'drinks': '1-3 min',
            };
            return (
              <div key={cat} className="bg-white rounded-xl p-4">
                <p className="font-medium capitalize">{cat}</p>
                <p className="text-orange-600 font-bold">{times[cat] || '10-15 min'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </RoleLayout>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className={`border-l-4 p-4 rounded-xl ${colors[color as keyof typeof colors] || colors.blue}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors[color as keyof typeof colors] || colors.blue} flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function OrderItemCard({ item, onAction, getElapsedMinutes }: { 
  item: any; 
  onAction: (orderId: string, itemId: string, action: string) => void;
  getElapsedMinutes: (startedAt: Date | string | undefined) => number;
}) {
  const statusConfig = {
    assigned: { bg: 'bg-blue-50', border: 'border-blue-200' },
    cooking: { bg: 'bg-orange-50', border: 'border-orange-200' },
    cooked: { bg: 'bg-green-50', border: 'border-green-200' },
    prepared: { bg: 'bg-green-50', border: 'border-green-200' },
    completed: { bg: 'bg-green-50', border: 'border-green-200' },
    default: { bg: 'bg-gray-50', border: 'border-gray-200' },
  };

  const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.default;

  return (
    <div className={'p-5 rounded-2xl border ' + config.bg + ' ' + config.border}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-bold text-gray-900">{item.orderNumber}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {item.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-500">Table {item.tableNumber}</span>
            <span className="text-sm text-gray-500">{item.customerName}</span>
          </div>
          <p className="text-gray-700 font-medium text-lg">{item.menuItem.name} x{item.quantity}</p>
          {item.specialInstructions && (
            <p className="text-xs text-gray-500 mt-1 italic">💬 \"" + item.specialInstructions + "\"</p>
          )}
          {item.startedAt && item.status === 'cooking' && (
            <p className="text-xs text-orange-600 mt-1 font-medium">⏱️ Cooking for " + getElapsedMinutes(item.startedAt) + " min</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {item.status === 'assigned' && (
            <button 
              onClick={() => onAction(item.orderId, item.id, 'start_cooking')}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/25"
            >
              🔥 Start Cooking
            </button>
          )}
          {item.status === 'cooking' && (
            <div className="flex gap-2">
              <button 
                onClick={() => onAction(item.orderId, item.id, 'mark_cooked')}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
              >
                ✅ Mark Cooked
              </button>
              <button 
                onClick={() => onAction(item.orderId, item.id, 'mark_prepared')}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-green-500 text-green-700 rounded-xl font-semibold hover:bg-green-50 transition-all"
              >
                🍽️ Mark Prepared
              </button>
            </div>
          )}
          {(item.status === 'cooked' || item.status === 'prepared') && (
            <button 
              onClick={() => onAction(item.orderId, item.id, 'mark_prepared')}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25"
            >
              🍽️ Mark Ready for Pickup
            </button>
          )}
          {item.status === 'completed' && (
            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✅ Completed</span>
          )}
        </div>
      </div>
    </div>
  );
}