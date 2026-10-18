'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Chef } from '@/types';
import { formatTime, getElapsedMinutes } from '@/lib/utils';

export default function HeadChefDashboardPage() {
  const { 
    orders, 
    chefs, 
    currentUser, 
    updateOrderItemStatus, 
    assignChefToItem,
    getAvailableChefsForCategory 
  } = useApp();
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [view, setView] = useState<'overview' | 'assign' | 'stations'>('overview');

  const lineChefs = chefs.filter(c => c.chefRole === 'line_chef' || c.chefRole === 'sous_chef');
  const headChef = chefs.find(c => c.chefRole === 'head_chef');
  const sousChefs = chefs.filter(c => c.chefRole === 'sous_chef');

  const pendingItems = orders.flatMap(order => 
    order.items
      .filter(item => item.status === 'pending')
      .map(item => ({ ...item, orderId: order.id, orderNumber: order.orderNumber, tableNumber: order.tableNumber, customerName: order.customerName }))
  );

  const cookingItems = orders.flatMap(order => 
    order.items
      .filter(item => item.status === 'cooking' || item.status === 'assigned')
      .map(item => ({ ...item, orderId: order.id, orderNumber: order.orderNumber, tableNumber: order.tableNumber, customerName: order.customerName }))
  );

  const readyItems = orders.flatMap(order => 
    order.items
      .filter(item => item.status === 'cooked' || item.status === 'prepared')
      .map(item => ({ ...item, orderId: order.id, orderNumber: order.orderNumber, tableNumber: order.tableNumber, customerName: order.customerName }))
  );

  const stations = [...new Set(lineChefs.map(c => c.station).filter(Boolean))];

  const getStationForItem = (item: any): string => {
    const menuItem = item.menuItem;
    if (!menuItem) return 'unassigned';
    const stationMap: Record<string, string> = {
      'mains': 'grill',
      'specials': 'saute',
      'appetizers': 'cold',
      'desserts': 'pastry',
      'drinks': 'bar',
    };
    return stationMap[menuItem.category] || 'unassigned';
  };

  const handleAssign = (orderId: string, itemId: string, chefId: string) => {
    assignChefToItem(orderId, itemId, chefId);
  };

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
      case 'reassign':
        updateOrderItemStatus(orderId, itemId, 'pending');
        break;
    }
  };

  const getChefForStation = (station: string) => 
    lineChefs.find(c => c.station === station);

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
            onClick={() => setView('assign')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'assign' ? 'bg-white text-red-600' : 'text-white/80 hover:text-white'}`}
          >
            Assign Orders ({pendingItems.length})
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
      {/* Kitchen Status Bar */}
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-semibold text-gray-900">KITCHEN LIVE</span>
            </div>
            <Badge variant="primary" size="md">{pendingItems.length} Pending</Badge>
            <Badge variant="warning" size="md">{cookingItems.length} Cooking</Badge>
            <Badge variant="success" size="md">{readyItems.length} Ready</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>👨‍🍳 {lineChefs.length} Line Chefs Active</span>
            <span>🔥 {stations.length} Stations</span>
          </div>
        </div>
      </Card>

      {view === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders - Need Assignment */}
          <Card variant="elevated" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Badge variant="warning" size="sm">PENDING ASSIGNMENT</Badge>
                <span>{pendingItems.length}</span>
              </h3>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {pendingItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>All orders assigned!</p>
                </div>
              ) : (
                pendingItems.map((item, index) => (
                  <OrderCard 
                    key={`${item.orderId}-${item.id}`} 
                    order={{ 
                      id: item.orderId,
                      orderNumber: item.orderNumber,
                      customerId: item.customerId || 'unknown',
                      customerName: item.customerName,
                      tableNumber: item.tableNumber,
                      items: [item],
                      status: item.status,
                      subtotal: item.totalPrice,
                      tax: item.totalPrice * 0.1,
                      total: item.totalPrice * 1.1,
                      paymentStatus: 'pending',
                      createdAt: item.createdAt || new Date(),
                      updatedAt: new Date(),
                    }} 
                    variant="kitchen" 
                    onAction={(order, action, itemId) => {
                      const station = getStationForItem(item);
                      const availableChefs = lineChefs.filter(c => c.station === station && c.activeOrders < c.maxConcurrentOrders);
                      if (availableChefs.length > 0 && action === 'assign') {
                        handleAssign(item.orderId, item.id, availableChefs[0].id);
                      }
                    }}
                    showChef={true}
                  />
                ))
              )}
            </div>
          </Card>

          {/* Cooking in Progress */}
          <Card variant="elevated" padding="md">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Badge variant="primary" size="sm">COOKING IN PROGRESS</Badge>
              <span>{cookingItems.length}</span>
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {cookingItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No items cooking</div>
              ) : (
                cookingItems.map((item, index) => (
                  <div key={`${item.orderId}-${item.id}`} className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{item.orderNumber}</span>
                        <Badge variant="warning" size="sm">{item.status.toUpperCase()}</Badge>
                        <Badge variant="info" size="sm" dot>{item.assignedChefId || 'Unassigned'}</Badge>
                      </div>
                      {item.startedAt && (
                        <span className="text-xs text-orange-600 font-medium">{getElapsedMinutes(item.startedAt)} min</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{item.menuItem.name} x{item.quantity}</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="secondary" onClick={() => handleAction(item.orderId, item.id, 'mark_cooked')}>
                          Cooked
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleAction(item.orderId, item.id, 'reassign')}>
                          Reassign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Ready for Pickup */}
          <Card variant="elevated" padding="md">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Badge variant="success" size="sm">READY FOR PICKUP</Badge>
              <span>{readyItems.length}</span>
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {readyItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nothing ready yet</div>
              ) : (
                readyItems.map((item, index) => (
                  <div key={`${item.orderId}-${item.id}`} className="p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{item.orderNumber}</span>
                        <Badge variant="success" size="sm">{item.status.toUpperCase()}</Badge>
                      </div>
                      <Button size="sm" variant="success" onClick={() => handleAction(item.orderId, item.id, 'mark_prepared')}>
                        Notify Server
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{item.menuItem.name} x{item.quantity} — Table {item.tableNumber}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {view === 'assign' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Manual Order Assignment</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unassigned Orders */}
            <Card variant="elevated" padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Unassigned Items</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {pendingItems.map((item, index) => (
                  <div key={`${item.orderId}-${item.id}`} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 text-sm">{item.orderNumber}</span>
                      <Badge variant="info" size="sm">{getStationForItem(item)}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{item.menuItem.name} x{item.quantity}</p>
                    <div className="flex gap-2">
                      {lineChefs
                        .filter(c => c.station === getStationForItem(item) && c.activeOrders < c.maxConcurrentOrders)
                        .map(chef => (
                          <Button 
                            key={chef.id} 
                            size="sm" 
                            variant={chef.activeOrders >= chef.maxConcurrentOrders ? 'outline' : 'primary'}
                            onClick={() => handleAssign(item.orderId, item.id, chef.id)}
                            disabled={chef.activeOrders >= chef.maxConcurrentOrders}
                          >
                            {chef.name} ({chef.activeOrders}/{chef.maxConcurrentOrders})
                          </Button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Available Chefs */}
            <Card variant="elevated" padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Available Line Chefs</h3>
              <div className="space-y-3">
                {lineChefs.map(chef => (
                  <div key={chef.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold text-sm">
                        {chef.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{chef.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span>📍</span> {chef.station?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={chef.activeOrders >= chef.maxConcurrentOrders ? 'danger' : chef.activeOrders > 0 ? 'warning' : 'success'} size="md">
                        {chef.activeOrders}/{chef.maxConcurrentOrders}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {view === 'stations' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Station Overview</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {stations.map((station) => {
              const chef = getChefForStation(station);
              const stationItems = cookingItems.filter(item => getStationForItem(item) === station);
              const stationPending = pendingItems.filter(item => getStationForItem(item) === station);
              return (
                <Card key={station} variant="elevated" padding="lg" className="border-l-4 border-orange-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                        {station === 'grill' ? '🔥' : station === 'saute' ? '🍳' : station === 'pastry' ? '🍰' : station === 'cold' ? '🥗' : '🍳'}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 capitalize">{station} Station</h4>
                        <p className="text-sm text-gray-500">{chef?.name || 'Unstaffed'}</p>
                      </div>
                    </div>
                    <Badge variant={chef && chef.activeOrders < chef.maxConcurrentOrders ? 'success' : 'danger'} size="md">
                      {chef ? `${chef.activeOrders}/${chef.maxConcurrentOrders}` : 'Unstaffed'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cooking</span>
                      <span className="font-bold text-orange-600">{stationItems.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Pending</span>
                      <span className="font-bold text-yellow-600">{stationPending.length}</span>
                    </div>
                  </div>

                  {stationPending.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => setView('assign')}
                    >
                      Assign {stationPending.length} pending
                    </Button>
                  )}
                </Card>
              )}
            )}
          </div>
        </div>
      )}
    </RoleLayout>
  );
}