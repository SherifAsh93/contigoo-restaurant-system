'use client';

import { Order, OrderItem, OrderStatus, MenuCategory } from '@/types';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Card } from '@/components/Card';
import { ORDER_STATUS_CONFIG, MENU_CATEGORIES } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  variant?: 'compact' | 'full' | 'kitchen' | 'server' | 'customer';
  onAction?: (order: Order, action: string, itemId?: string) => void;
  showCustomer?: boolean;
  showTable?: boolean;
  showServer?: boolean;
  showChef?: boolean;
}

function getCategoryInfo(category: MenuCategory) {
  return MENU_CATEGORIES.find(c => c.value === category) || { label: category, icon: '🍽️' };
}

function formatTime(date: Date | undefined) {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getElapsedTime(startedAt: Date | undefined) {
  if (!startedAt) return '';
  const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 60000);
  return `${elapsed}m`;
}

export function OrderCard({ 
  order, 
  variant = 'full', 
  onAction,
  showCustomer = true,
  showTable = true,
  showServer = false,
  showChef = false,
}: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];
  const pendingItems = order.items.filter(i => i.status !== 'completed' && i.status !== 'cancelled' && i.status !== 'delivered');
  const completedItems = order.items.filter(i => i.status === 'completed' || i.status === 'delivered');
  const cookingItems = order.items.filter(i => i.status === 'cooking' || i.status === 'assigned');

  if (variant === 'compact') {
    return (
      <Card variant="outlined" padding="sm" className="hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusConfig.bgColor}`}>
              <span className="text-lg">{MENU_CATEGORIES[0]?.icon || '🍽️'}</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">Order {order.orderNumber}</p>
              <p className="text-sm text-gray-500">
                {showTable && order.tableNumber && `Table ${order.tableNumber} • `}
                {showCustomer && order.customerName}
                {showServer && order.assignedServerId && ` • Server assigned`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} size="sm">
              {statusConfig.label}
            </Badge>
            <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'kitchen') {
    return (
      <Card variant="elevated" padding="md" className={`border-l-4 ${statusConfig.color === '#ef4444' ? 'border-red-500' : statusConfig.color === '#10b981' ? 'border-green-500' : statusConfig.color === '#f97316' ? 'border-orange-500' : 'border-blue-500'}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg font-mono">
                {order.orderNumber}
              </span>
              {showTable && order.tableNumber && (
                <Badge variant="primary" size="lg" dot>Table {order.tableNumber}</Badge>
              )}
              <Badge variant="info" size="lg">{statusConfig.label}</Badge>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {showCustomer && `Customer: ${order.customerName}`}
              {showChef && cookingItems.length > 0 && (
                <> • Chef: {cookingItems[0].assignedChefId ? 'Assigned' : 'Unassigned'}</>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Created: {formatTime(order.createdAt)}</span>
          </div>
        </div>

        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-4 p-3 rounded-xl ${
                item.status === 'completed' || item.status === 'cancelled' 
                  ? 'bg-gray-50 opacity-60' 
                  : item.status === 'cooking' 
                    ? 'bg-orange-50 border border-orange-200' 
                    : item.status === 'assigned' 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-500">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900 truncate">{item.menuItem.name}</span>
                  {item.quantity > 1 && (
                    <Badge variant="default" size="sm">x{item.quantity}</Badge>
                  )}
                  <Badge variant="warning" size="sm">{ORDER_STATUS_CONFIG[item.status].label}</Badge>
                  {item.assignedChefId && (
                    <Badge variant="info" size="sm">Chef: {item.assignedChefId}</Badge>
                  )}
                </div>
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500 mt-1 italic">"{item.specialInstructions}"</p>
                )}
                {item.startedAt && item.status === 'cooking' && (
                  <p className="text-xs text-orange-600 mt-1">Cooking for {getElapsedTime(item.startedAt)}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900 w-20 text-right">{formatCurrency(item.totalPrice)}</span>
                {item.status === 'pending' && (
                  <Button size="sm" variant="primary" onClick={() => onAction?.(order, 'assign', item.id)}>
                    Assign
                  </Button>
                )}
                {item.status === 'assigned' && (
                  <Button size="sm" variant="success" onClick={() => onAction?.(order, 'start_cooking', item.id)}>
                    Start Cooking
                  </Button>
                )}
                {item.status === 'cooking' && (
                  <Button size="sm" variant="primary" onClick={() => onAction?.(order, 'mark_cooked', item.id)}>
                    Mark Cooked
                  </Button>
                )}
                {item.status === 'cooked' && (
                  <Button size="sm" variant="secondary" onClick={() => onAction?.(order, 'mark_prepared', item.id)}>
                    Mark Prepared
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Special Instructions:</strong> {order.specialInstructions}
            </p>
          </div>
        )}
      </Card>
    );
  }

  if (variant === 'server') {
    const readyItems = order.items.filter(i => i.status === 'prepared' || i.status === 'cooked');
    const deliveringItems = order.items.filter(i => i.status === 'delivering');
    const deliveredItems = order.items.filter(i => i.status === 'delivered' || i.status === 'completed');

    return (
      <Card variant="elevated" padding="md" className={`border-l-4 ${readyItems.length > 0 ? 'border-green-500' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg font-mono">
              {order.orderNumber}
            </span>
            {showTable && order.tableNumber && (
              <Badge variant="primary" size="lg" dot>Table {order.tableNumber}</Badge>
            )}
            <Badge variant={readyItems.length > 0 ? 'success' : 'warning'} size="lg">
              {readyItems.length > 0 ? 'Ready for Pickup' : 'Not Ready'}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
          </div>
        </div>

        {readyItems.length > 0 && (
          <div className="space-y-2 mb-4 p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-sm font-medium text-green-700 mb-2">Ready to Deliver:</p>
            <div className="space-y-1">
              {readyItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.menuItem.name} x{item.quantity}</span>
                  <Button size="sm" variant="success" onClick={() => onAction?.(order, 'pickup', item.id)}>
                    Pickup & Deliver
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveringItems.length > 0 && (
          <div className="space-y-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-blue-700 mb-2">Currently Delivering:</p>
            <div className="space-y-1">
              {deliveringItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.menuItem.name} x{item.quantity}</span>
                  <Button size="sm" variant="primary" onClick={() => onAction?.(order, 'mark_delivered', item.id)}>
                    Mark Delivered
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {deliveredItems.length > 0 && (
          <div className="space-y-1 text-sm text-gray-500">
            <p className="font-medium">Delivered:</p>
            {deliveredItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <span>{item.menuItem.name} x{item.quantity}</span>
                <span className="text-green-600">✓ Delivered</span>
              </div>
            ))}
          </div>
        )}

        {order.specialInstructions && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Special Instructions:</strong> {order.specialInstructions}
            </p>
          </div>
        )}
      </Card>
    );
  }

  if (variant === 'customer') {
    return (
      <Card variant="elevated" padding="md">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Order #{order.orderNumber.slice(-4)}</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</p>
          </div>
          <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} size="lg">
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xl">{getCategoryInfo(item.menuItem.category).icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 truncate">{item.menuItem.name}</span>
                  <Badge variant="default" size="sm">x{item.quantity}</Badge>
                  <Badge variant={item.status === 'completed' ? 'success' : 'warning'} size="sm">
                    {ORDER_STATUS_CONFIG[item.status].label}
                  </Badge>
                </div>
                {item.specialInstructions && (
                  <p className="text-xs text-gray-500 mt-1 italic">"{item.specialInstructions}"</p>
                )}
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-2">
            <span className="text-gray-900 font-bold">Total</span>
            <span className="text-gray-900 font-bold text-lg">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {order.paymentStatus === 'pending' && order.status === 'completed' && (
          <Button className="w-full mt-4" size="lg" variant="success" onClick={() => onAction?.(order, 'pay')}>
            Pay Now - {formatCurrency(order.total)}
          </Button>
        )}

        {order.status === 'cancelled' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            This order was cancelled.
          </div>
        )}
      </Card>
    );
  }

  // Default full variant
  return (
    <Card variant="elevated" padding="md">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg font-mono">
            {order.orderNumber}
          </span>
          {showTable && order.tableNumber && (
            <Badge variant="primary" size="lg" dot>Table {order.tableNumber}</Badge>
          )}
          <Badge variant={statusConfig.color === '#10b981' ? 'success' : statusConfig.color === '#ef4444' ? 'danger' : 'warning'} size="lg">
            {statusConfig.label}
          </Badge>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm">
              {getCategoryInfo(item.menuItem.category).icon}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-medium text-gray-900">{item.menuItem.name}</span>
              {item.specialInstructions && (
                <p className="text-xs text-gray-500 italic">"{item.specialInstructions}"</p>
              )}
            </div>
            <Badge variant="warning" size="sm">{ORDER_STATUS_CONFIG[item.status].label}</Badge>
            <span className="font-medium w-20 text-right">{formatCurrency(item.totalPrice)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
        <div className="flex justify-between border-t pt-2"><span className="font-bold">Total</span><span className="font-bold">{formatCurrency(order.total)}</span></div>
      </div>
    </Card>
  );
}