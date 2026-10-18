'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { DailyReport } from '@/types';
import { formatCurrency, formatTime } from '@/lib/utils';

export default function OwnerOverviewPage() {
  const router = useRouter();
  const { orders, dailyReport, chefs, tables, users, getOrdersForRole } = useApp();
  const myOrders = getOrdersForRole('owner', 'u1');

  const stats = {
    activeOrders: orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    cookingOrders: orders.filter(o => o.status === 'cooking' || o.status === 'assigned').length,
    readyOrders: orders.filter(o => o.status === 'prepared' || o.status === 'cooked').length,
    todayRevenue: dailyReport.totalRevenue,
    todayOrders: dailyReport.totalOrders,
    avgOrderValue: dailyReport.averageOrderValue,
    completionRate: dailyReport.totalOrders > 0 ? Math.round((dailyReport.completedOrders / dailyReport.totalOrders) * 100) : 0,
  };

  const recentOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5);

  return (
    <RoleLayout role="owner" title="Dashboard Overview" subtitle="Real-time restaurant performance">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Active Orders" 
          value={stats.activeOrders} 
          icon="📋" 
          color="blue" 
          trend={`${stats.pendingOrders} pending`}
        />
        <StatCard 
          label="In Kitchen" 
          value={stats.cookingOrders} 
          icon="🍳" 
          color="orange" 
          trend={`${stats.readyOrders} ready`}
        />
        <StatCard 
          label="Today's Revenue" 
          value={formatCurrency(stats.todayRevenue)} 
          icon="💰" 
          color="green" 
          trend={`${stats.todayOrders} orders`}
        />
        <StatCard 
          label="Completion Rate" 
          value={`${stats.completionRate}%`} 
          icon="✅" 
          color="purple" 
          trend={`Avg: ${formatCurrency(stats.avgOrderValue)}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Button variant="outline" size="sm" onClick={() => router.push('/owner/orders')}>
              View All →
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <OrderCard key={order.id} order={order} variant="compact" />
              ))
            )}
          </div>
        </Card>

        {/* Side Panel - Kitchen Status & Quick Actions */}
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Kitchen Status</h3>
            <div className="space-y-3">
              {chefs.map(chef => (
                <div key={chef.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold">
                      {chef.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{chef.name}</p>
                      <p className="text-xs text-gray-500">{chef.specialties.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={chef.activeOrders >= chef.maxConcurrentOrders ? 'danger' : chef.activeOrders > 0 ? 'warning' : 'success'} size="sm">
                      {chef.activeOrders}/{chef.maxConcurrentOrders}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{chef.isAvailable ? 'Available' : 'Busy'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Table Status</h3>
            <div className="grid grid-cols-4 gap-2">
              {tables.map(table => (
                <div key={table.id} className={`p-3 rounded-xl text-center ${table.status === 'occupied' ? 'bg-green-50 border border-green-200' : table.status === 'reserved' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className="text-lg font-bold text-gray-900">{table.number}</p>
                  <p className="text-xs text-gray-500 capitalize">{table.status}</p>
                  {table.currentOrderId && (
                    <p className="text-xs text-blue-600 font-medium">{table.currentOrderId}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card variant="outlined" padding="lg" className="border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push('/owner/menu')}>
                📖 Manage Menu
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push('/owner/staff')}>
                👥 Manage Staff
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push('/owner/reports')}>
                📈 View Reports
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" onClick={() => router.push('/owner/settings')}>
                ⚙️ Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card variant="elevated" padding="lg" className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Revenue by Hour</h3>
        <div className="h-64 flex items-end justify-around gap-2 px-4">
          {dailyReport.ordersByHour.map((hour, i) => (
            <div key={hour.hour} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500"
                style={{ height: `${Math.max(20, (hour.revenue / Math.max(...dailyReport.ordersByHour.map(h => h.revenue))) * 200)}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{hour.hour}:00</span>
              <span className="text-xs font-medium text-gray-900">{formatCurrency(hour.revenue)}</span>
            </div>
          ))}
        </div>
      </Card>
    </RoleLayout>
  );
}

function StatCard({ label, value, icon, color, trend }: { label: string; value: string | number; icon: string; color: string; trend: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <Card variant="elevated" padding="lg" className={`border-l-4 ${colors[color as keyof typeof colors] || colors.blue}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{trend}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors[color as keyof typeof colors] || colors.blue} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}