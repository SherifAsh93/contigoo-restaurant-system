'use client';

import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { DailyReport } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function OwnerReportsPage() {
  const { dailyReport, orders } = useApp();

  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Weekly data (mock)
  const weeklyData = [
    { day: 'Mon', revenue: 2450, orders: 18 },
    { day: 'Tue', revenue: 3200, orders: 22 },
    { day: 'Wed', revenue: 2800, orders: 20 },
    { day: 'Thu', revenue: 3500, orders: 25 },
    { day: 'Fri', revenue: 4800, orders: 30 },
    { day: 'Sat', revenue: 5200, orders: 32 },
    { day: 'Sun', revenue: 3100, orders: 19 },
  ];

  const topItems = [
    { name: 'Ribeye Steak', count: 45, revenue: 1890 },
    { name: 'Chicken Parmesan', count: 38, revenue: 988 },
    { name: 'Tiramisu', count: 52, revenue: 520 },
    { name: 'House Red Wine', count: 60, revenue: 720 },
    { name: 'Lobster Linguine', count: 18, revenue: 864 },
  ];

  return (
    <RoleLayout role="owner" title="Reports & Analytics" subtitle="Business performance insights">
      {/* Date Range Selector */}
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="font-medium text-gray-700">Period:</label>
          <select className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last 30 Days</option>
            <option>Custom Range</option>
          </select>
          <Button variant="outline" className="ml-auto">Export PDF</Button>
          <Button variant="outline" className="ml-2">Export CSV</Button>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} icon="💰" color="green" trend="+12% vs last week" />
        <StatCard label="Total Orders" value={dailyReport.totalOrders} icon="📋" color="blue" trend="+8% vs last week" />
        <StatCard label="Avg Order Value" value={formatCurrency(avgOrderValue)} icon="📊" color="purple" trend="+5% vs last week" />
        <StatCard label="Completion Rate" value={`${dailyReport.totalOrders > 0 ? Math.round((dailyReport.completedOrders / dailyReport.totalOrders) * 100) : 0}%`} icon="✅" color="green" trend={dailyReport.cancelledOrders > 0 ? `${dailyReport.cancelledOrders} cancelled` : '0 cancelled'} />
        <StatCard label="Active Tables" value={orders.filter(o => !['completed', 'cancelled'].includes(o.status)).length} icon="🪑" color="orange" trend="Real-time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Revenue</h3>
          <div className="h-80 flex items-end justify-around gap-3 px-4">
            {weeklyData.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-700 hover:to-blue-500 cursor-pointer"
                  style={{ height: `${Math.max(30, (day.revenue / Math.max(...weeklyData.map(d => d.revenue))) * 250)}px` }}
                  title={`${day.day}: ${formatCurrency(day.revenue)} (${day.orders} orders)`}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                <span className="text-xs font-medium text-gray-900">{formatCurrency(day.revenue)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Selling Items */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.count} sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(item.revenue)}</p>
                  <p className="text-xs text-gray-500">{Math.round(item.revenue / totalRevenue * 100)}% of revenue</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Category Performance */}
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
          <div className="space-y-3">
            {dailyReport.ordersByCategory.map(cat => (
              <div key={cat.category} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600 capitalize">{cat.category}</div>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${(cat.revenue / Math.max(...dailyReport.ordersByCategory.map(c => c.revenue))) * 100}%` }}
                  ></div>
                </div>
                <div className="w-24 text-sm font-medium text-right text-gray-900">{formatCurrency(cat.revenue)}</div>
                <div className="w-16 text-sm text-gray-500 text-right">{cat.count} orders</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Server Performance</h3>
          <div className="space-y-3">
            {dailyReport.serverPerformance.map(server => (
              <div key={server.serverId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{server.name}</p>
                  <p className="text-sm text-gray-500">{server.ordersDelivered} orders delivered</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(server.tips)} tips</p>
                  <p className="text-xs text-gray-500">Avg: {formatCurrency(server.tips / Math.max(server.ordersDelivered, 1))}/order</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Chef Performance</h3>
          <div className="space-y-3">
            {dailyReport.chefPerformance.map(chef => (
              <div key={chef.chefId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900">{chef.name}</p>
                  <p className="text-sm text-gray-500">{chef.ordersCooked} orders cooked</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{chef.avgTimeMinutes} min avg</p>
                  <p className="text-xs text-gray-500">Efficiency: {Math.round(100 - chef.avgTimeMinutes)}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
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