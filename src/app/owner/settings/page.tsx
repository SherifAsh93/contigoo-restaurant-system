'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Badge } from '@/components/Badge';
import { Select } from '@/components/Input';

export default function OwnerSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'monetization' | 'notifications' | 'integrations'>('general');
  const [restaurantName, setRestaurantName] = useState('Contigoo Bistro');
  const [contactEmail, setContactEmail] = useState('info@contigoo.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Main Street, Cairo, Egypt');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('Africa/Cairo');
  const [taxRate, setTaxRate] = useState(10);

  const [monetizationModel, setMonetizationModel] = useState<'subscription' | 'lifetime'>('subscription');
  const [subscriptionPrice, setSubscriptionPrice] = useState(299);
  const [lifetimePrice, setLifetimePrice] = useState(14999);

  return (
    <RoleLayout role="owner" title="Settings" subtitle="Configure your restaurant system">
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-4" role="tablist">
          {[
            { id: 'general', label: 'General', icon: '⚙️' },
            { id: 'monetization', label: 'Monetization', icon: '💰' },
            { id: 'notifications', label: 'Notifications', icon: '🔔' },
            { id: 'integrations', label: 'Integrations', icon: '🔗' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">{tab.icon} {tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Restaurant Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Restaurant Name" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} />
              <Input label="Contact Email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
              <Input label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
              <Select
                label="Currency"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'EGP', label: 'EGP (ج.م)' },
                  { value: 'SAR', label: 'SAR (﷼)' },
                ]}
              />
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Address & Localization</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} className="md:col-span-2" />
              <Select
                label="Timezone"
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
                options={[
                  { value: 'Africa/Cairo', label: 'Africa/Cairo (EET)' },
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                  { value: 'Europe/London', label: 'Europe/London (GMT)' },
                ]}
              />
              <Input label="Tax Rate (%)" type="number" step="0.1" min="0" max="100" value={taxRate} onChange={e => setTaxRate(parseFloat(e.target.value))} />
            </div>
          </Card>

          <Card variant="outlined" padding="lg" className="border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Branding</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <div className="w-32 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">Upload Logo</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input type="color" value="#2563eb" className="w-16 h-10 rounded-lg border border-gray-200 cursor-pointer" />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button size="lg">Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'monetization' && (
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Billing Model</h3>
            <div className="flex gap-6">
              <label className="flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-green-300">
                <input type="radio" name="model" value="subscription" checked={monetizationModel === 'subscription'} onChange={e => setMonetizationModel('subscription')} className="sr-only" />
                <div className={`text-center ${monetizationModel === 'subscription' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                  <div className="text-4xl mb-2">🔄</div>
                  <h4 className="font-bold text-lg mb-2">Subscription</h4>
                  <p className="text-gray-600 mb-4">Recurring monthly/annual payments</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-white rounded-lg border">
                      <span>Monthly</span>
                      <span className="font-bold">${subscriptionPrice}/month</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-lg border">
                      <span>Annual (15% off)</span>
                      <span className="font-bold">${Math.round(subscriptionPrice * 12 * 0.85)}/year</span>
                    </div>
                  </div>
                </div>
              </label>
              <label className="flex-1 p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-green-300">
                <input type="radio" name="model" value="lifetime" checked={monetizationModel === 'lifetime'} onChange={e => setMonetizationModel('lifetime')} className="sr-only" />
                <div className={`text-center ${monetizationModel === 'lifetime' ? 'bg-green-50 border-green-500' : 'border-gray-200'}`}>
                  <div className="text-4xl mb-2">💎</div>
                  <h4 className="font-bold text-lg mb-2">Lifetime License</h4>
                  <p className="text-gray-600 mb-4">One-time payment, perpetual access</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-white rounded-lg border">
                      <span>One-time</span>
                      <span className="font-bold">${lifetimePrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-500">Includes 1 year support</p>
                  </div>
                </div>
              </label>
            </div>
          </Card>

          {monetizationModel === 'subscription' && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Subscription Pricing</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Monthly Price ($)" type="number" min="0" step="1" value={subscriptionPrice} onChange={e => setSubscriptionPrice(parseInt(e.target.value))} />
                <p className="text-gray-500 self-center">Annual price calculated automatically with 15% discount</p>
              </div>
            </Card>
          )}

          {monetizationModel === 'lifetime' && (
            <Card variant="elevated" padding="lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Lifetime License Pricing</h3>
              <Input label="One-time Price ($)" type="number" min="0" step="100" value={lifetimePrice} onChange={e => setLifetimePrice(parseInt(e.target.value))} />
            </Card>
          )}

          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>
            <div className="flex flex-wrap gap-4">
              {['Stripe', 'PayPal', 'Paymob', 'Fawry', 'Cash'].map(method => (
                <label key={method} className="flex items-center gap-2 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded border-gray-300" defaultChecked />
                  <span className="font-medium">{method}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { title: 'New Order Alerts', desc: 'Get notified when new orders are placed', enabled: true },
                { title: 'Order Ready Notifications', desc: 'Notify servers when orders are ready for pickup', enabled: true },
                { title: 'Low Stock Alerts', desc: 'Alert when inventory items are running low', enabled: true },
                { title: 'Daily Summary Report', desc: 'Receive end-of-day sales report via email', enabled: true },
                { title: 'Staff Shift Reminders', desc: 'Remind staff about upcoming shifts', enabled: false },
              ].map(item => (
                <label key={item.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={item.enabled} className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                </label>
              ))}
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Channels</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="text-center">
                  <div className="text-3xl mb-2">📱</div>
                  <h4 className="font-bold mb-1">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Mobile app push alerts</p>
                </div>
              </label>
              <label className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
                <input type="checkbox" className="sr-only" defaultChecked />
                <div className="text-center">
                  <div className="text-3xl mb-2">📧</div>
                  <h4 className="font-bold mb-1">Email</h4>
                  <p className="text-sm text-gray-500">Email notifications</p>
                </div>
              </label>
              <label className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
                <input type="checkbox" className="sr-only" />
                <div className="text-center">
                  <div className="text-3xl mb-2">💬</div>
                  <h4 className="font-bold mb-1">SMS</h4>
                  <p className="text-sm text-gray-500">Text message alerts</p>
                </div>
              </label>
              <label className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300">
                <input type="checkbox" className="sr-only" />
                <div className="text-center">
                  <div className="text-3xl mb-2">💚</div>
                  <h4 className="font-bold mb-1">WhatsApp</h4>
                  <p className="text-sm text-gray-500">WhatsApp Business API</p>
                </div>
              </label>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Third-Party Integrations</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'POS System', desc: 'Connect your point-of-sale', icon: '💳', connected: true },
                { name: 'Accounting Software', desc: 'QuickBooks, Xero integration', icon: '📊', connected: false },
                { name: 'Delivery Platforms', desc: 'UberEats, DoorDash, Talabat', icon: '🚚', connected: false },
                { name: 'Reservation System', desc: 'OpenTable, Resy integration', icon: '📅', connected: false },
                { name: 'Loyalty Program', desc: 'Customer rewards & points', icon: '🎁', connected: false },
                { name: 'Kitchen Display', desc: 'Hardware KDS integration', icon: '🖥️', connected: true },
              ].map(item => (
                <label key={item.name} className={`p-4 border-2 rounded-xl cursor-pointer ${item.connected ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.icon}</span>
                    <Badge variant={item.connected ? 'success' : 'default'} size="sm">
                      {item.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                  <Button variant={item.connected ? 'outline' : 'primary'} size="sm" className="w-full mt-3">
                    {item.connected ? 'Manage' : 'Connect'}
                  </Button>
                </label>
              ))}
            </div>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3 className="text-lg font-bold text-gray-900 mb-6">API Access</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">API Key</h4>
                  <Button variant="outline" size="sm">Regenerate</Button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded font-mono text-sm">sk_live_abc123...</code>
                  <Button variant="outline" size="sm">Copy</Button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <h4 className="font-bold mb-2">Webhook URLs</h4>
                <div className="space-y-2">
                  <Input label="Order Events Webhook" placeholder="https://your-app.com/webhooks/orders" />
                  <Input label="Payment Events Webhook" placeholder="https://your-app.com/webhooks/payments" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </RoleLayout>
  );
}