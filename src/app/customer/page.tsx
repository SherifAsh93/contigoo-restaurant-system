'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { OrderCard } from '@/components/OrderCard';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { MenuItem, MenuCategory } from '@/types';
import { MOCK_MENU, MOCK_CATEGORIES } from '@/lib/mockData';
import { formatCurrency, formatTime } from '@/lib/utils';

const CATEGORY_ICONS: Record<MenuCategory, string> = {
  appetizers: '🥗',
  mains: '🍖',
  desserts: '🍰',
  drinks: '🥤',
  specials: '⭐',
};

export default function CustomerDashboardPage() {
  const { currentUser, orders, menu, addOrder, addNotification } = useApp();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('mains');
  const [cart, setCart] = useState<{ item: MenuItem; quantity: number; specialInstructions?: string }[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [ordersHistory, setOrdersHistory] = useState(() => orders.filter(o => o.customerId === currentUser?.id));
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');

  // Sync orders when they change
  useEffect(() => {
    if (currentUser) {
      setOrdersHistory(orders.filter(o => o.customerId === currentUser.id));
    }
  }, [orders, currentUser]);

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const tax = cartTotal * 0.1;
  const grandTotal = cartTotal + tax;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { item, quantity: 1, specialInstructions: '' }];
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(ci => ci.item.id !== itemId));
      return;
    }
    setCart(prev => prev.map(ci => ci.item.id === itemId ? { ...ci, quantity } : ci));
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const handleVoiceOrder = () => {
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      const samples = [
        "I'd like the ribeye steak medium rare",
        "Two chicken parmesan and a caesar salad",
        "One lobster linguine and a glass of red wine",
        "The wagyu burger with fries",
        "Tiramisu and an espresso",
      ];
      const sample = samples[Math.floor(Math.random() * samples.length)];
      setVoiceTranscript(sample);
      setIsListening(false);
      
      // Try to parse and add to cart
      parseVoiceOrder(sample);
    }, 1500);
  };

  const parseVoiceOrder = (transcript: string) => {
    // Simple keyword matching for demo
    const lower = transcript.toLowerCase();
    menu.forEach(item => {
      if (lower.includes(item.name.toLowerCase())) {
        addToCart(item);
      }
    });
  };

  const placeOrder = () => {
    if (cart.length === 0 || !currentUser) return;

    const orderItems = cart.map(ci => ({
      id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      menuItemId: ci.item.id,
      menuItem: ci.item,
      quantity: ci.quantity,
      unitPrice: ci.item.price,
      totalPrice: ci.item.price * ci.quantity,
      status: 'pending' as const,
      specialInstructions: ci.specialInstructions,
    }));

    const { subtotal, tax: taxAmount, total } = orderItems.reduce(
      (acc, item) => {
        acc.subtotal += item.totalPrice;
        return acc;
      },
      { subtotal: 0, tax: 0, total: 0 }
    );

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      tableNumber: '1',
      items: orderItems,
      status: 'pending' as const,
      subtotal,
      tax: taxAmount,
      total,
      paymentStatus: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addOrder(newOrder);
    addNotification({
      userId: 'kitchen',
      type: 'order_created',
      title: 'New Order Received',
      message: `Order ${newOrder.orderNumber} from ${currentUser.name}`,
      read: false,
      relatedOrderId: newOrder.id,
    });

    clearCart();
    setShowCart(false);
  };

  const categoryItems = menu.filter(item => item.category === activeCategory && item.available);

  return (
    <RoleLayout 
      role="customer" 
      title={activeTab === 'menu' ? 'Our Menu' : 'My Orders'} 
      subtitle={activeTab === 'menu' ? 'Browse and order your favorites' : 'Track your order status'}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${activeTab === 'menu' ? 'bg-white text-green-600' : 'text-white/80 hover:text-white'}`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium relative ${activeTab === 'orders' ? 'bg-white text-green-600' : 'text-white/80 hover:text-white'}`}
          >
            Orders
            {ordersHistory.filter(o => !['completed', 'cancelled'].includes(o.status)).length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {ordersHistory.filter(o => !['completed', 'cancelled'].includes(o.status)).length}
              </span>
            )}
          </button>
          {cartCount > 0 && (
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 rounded-lg bg-white/20 hover:bg-white/30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a2 2 0 00-2-2H6a2 2 0 00-2 2v4m0 0l-4 4m4-4h14m-4 4l4 4M6 7H4a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2h-2" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      }
    >
      {activeTab === 'menu' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu Sidebar */}
          <aside className="lg:col-span-1">
            <Card variant="elevated" padding="md" className="sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-1">
                {MOCK_CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                      activeCategory === cat.value
                        ? 'bg-green-50 text-green-700 font-semibold border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Menu Items */}
          <div className="lg:col-span-3 space-y-6">
            {categoryItems.length === 0 ? (
              <Card variant="outlined" padding="lg" className="text-center">
                <p className="text-gray-500">No items available in this category</p>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {categoryItems.map(item => (
                  <MenuItemCard key={item.id} item={item} onAdd={addToCart} inCart={cart.find(ci => ci.item.id === item.id)?.quantity || 0} />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Orders */}
          {ordersHistory.filter(o => !['completed', 'cancelled'].includes(o.status)).length > 0 && (
            <Card variant="elevated" padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Active Orders</h3>
              <div className="space-y-4">
                {ordersHistory.filter(o => !['completed', 'cancelled'].includes(o.status)).map(order => (
                  <OrderCard key={order.id} order={order} variant="customer" />
                ))}
              </div>
            </Card>
          )}

          {/* Order History */}
          <Card variant="elevated" padding="md">
            <h3 className="font-bold text-gray-900 mb-4">Order History</h3>
            <div className="space-y-3">
              {ordersHistory.filter(o => ['completed', 'cancelled'].includes(o.status)).slice(0, 10).map(order => (
                <OrderCard key={order.id} order={order} variant="compact" />
              ))}
              {ordersHistory.filter(o => ['completed', 'cancelled'].includes(o.status)).length === 0 && (
                <p className="text-gray-500 text-center py-4">No past orders yet</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setShowCart(false)} />
      )}
      {showCart && (
        <aside className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 animate-slide-in">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(ci => (
                    <div key={ci.item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center">
                        <span className="text-2xl">{CATEGORY_ICONS[ci.item.category]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium">{ci.item.name}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(ci.item.price)} each</p>
                        {ci.specialInstructions && (
                          <p className="text-xs text-gray-500 italic mt-1">"{ci.specialInstructions}"</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(ci.item.id, ci.quantity - 1)} className="w-8 h-8 border rounded flex items-center justify-center">-</button>
                          <span className="w-8 text-center font-medium">{ci.quantity}</span>
                          <button onClick={() => updateQuantity(ci.item.id, ci.quantity + 1)} className="w-8 h-8 border rounded flex items-center justify-center">+</button>
                          <button onClick={() => removeFromCart(ci.item.id)} className="ml-auto text-red-600 text-sm">Remove</button>
                        </div>
                        <Input
                          placeholder="Special instructions (optional)"
                          value={ci.specialInstructions || ''}
                          onChange={e => setCart(prev => prev.map(c => c.item.id === ci.item.id ? { ...c, specialInstructions: e.target.value } : c))}
                          className="mt-2"
                        />
                      </div>
                      <span className="font-bold text-gray-900 w-20 text-right">{formatCurrency(ci.item.price * ci.quantity)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
                <Button 
                  className="w-full" 
                  size="lg" 
                  variant="success" 
                  onClick={placeOrder}
                >
                  Place Order - {formatCurrency(grandTotal)}
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline" 
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Voice AI Modal */}
      {isListening && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h8m-4 0v-3" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Listening...</h3>
            <p className="text-gray-500 mb-6">Speak your order now</p>
            <button 
              onClick={() => { setIsListening(false); setVoiceTranscript(''); }}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {voiceTranscript && !isListening && (
        <div className="fixed bottom-24 right-4 z-50 max-w-md w-full mx-4 animate-slide-in">
          <Card variant="elevated" padding="md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">Voice Order Detected</p>
                <p className="text-gray-600">"{voiceTranscript}"</p>
                <p className="text-xs text-green-600 mt-2">Items added to cart automatically</p>
              </div>
              <button onClick={() => setVoiceTranscript('')} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          </Card>
        </div>
      )}
    </RoleLayout>
  );
}

function MenuItemCard({ item, onAdd, inCart }: { item: MenuItem; onAdd: (item: MenuItem) => void; inCart: number }) {
  return (
    <Card variant="elevated" padding="md" className="hover:shadow-lg transition-shadow group">
      <div className="aspect-video w-full rounded-xl bg-gray-100 mb-4 flex items-center justify-center overflow-hidden relative">
        <span className="text-5xl">{CATEGORY_ICONS[item.category]}</span>
        {item.available === false && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger">Unavailable</Badge>
          </div>
        )}
      </div>
      
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="default" size="sm">{item.prepTimeMinutes} min</Badge>
            {item.allergens.length > 0 && (
              <Badge variant="info" size="sm">{item.allergens.join(', ')}</Badge>
            )}
          </div>
        </div>
        <span className="text-xl font-bold text-gray-900 whitespace-nowrap">{formatCurrency(item.price)}</span>
      </div>

      <div className="flex items-center gap-3">
        {inCart > 0 ? (
          <div className="flex-1 flex items-center justify-end gap-2">
            <button onClick={() => onAdd(item)} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" aria-label="Remove">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <span className="w-10 text-center font-bold text-gray-900">{inCart}</span>
            <button onClick={() => onAdd(item)} className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors" aria-label="Add more">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        ) : (
          <Button 
            className="flex-1" 
            onClick={() => onAdd(item)} 
            disabled={!item.available}
            size="md"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </Card>
  );
}