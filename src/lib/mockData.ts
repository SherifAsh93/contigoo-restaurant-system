import { MenuItem, Order, Chef, Table, User, DailyReport, MenuCategory } from '@/types';

export const MOCK_MENU: MenuItem[] = [
  // Appetizers
  {
    id: 'm1',
    name: 'Caesar Salad',
    description: 'Fresh romaine, parmesan, croutons, house caesar dressing',
    price: 12.00,
    category: 'appetizers',
    available: true,
    prepTimeMinutes: 8,
    allergens: ['dairy', 'gluten', 'eggs'],
  },
  {
    id: 'm2',
    name: 'Bruschetta Trio',
    description: 'Grilled baguette with tomato-basil, mushroom, and olive tapenade',
    price: 10.00,
    category: 'appetizers',
    available: true,
    prepTimeMinutes: 10,
    allergens: ['gluten'],
  },
  {
    id: 'm3',
    name: 'Calamari Fritti',
    description: 'Crispy fried calamari with marinara and lemon aioli',
    price: 16.00,
    category: 'appetizers',
    available: true,
    prepTimeMinutes: 12,
    allergens: ['seafood', 'gluten'],
  },
  {
    id: 'm4',
    name: 'Soup of the Day',
    description: 'Chef\'s daily creation - ask your server',
    price: 8.00,
    category: 'appetizers',
    available: true,
    prepTimeMinutes: 5,
    allergens: [],
  },

  // Mains
  {
    id: 'm5',
    name: 'Ribeye Steak (12oz)',
    description: 'Grilled to perfection, garlic herb butter, roasted vegetables',
    price: 42.00,
    category: 'mains',
    available: true,
    prepTimeMinutes: 25,
    allergens: ['dairy'],
  },
  {
    id: 'm6',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon, lemon dill sauce, quinoa pilaf, asparagus',
    price: 34.00,
    category: 'mains',
    available: true,
    prepTimeMinutes: 20,
    allergens: ['seafood', 'dairy'],
  },
  {
    id: 'm7',
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast, marinara, mozzarella, spaghetti',
    price: 26.00,
    category: 'mains',
    available: true,
    prepTimeMinutes: 22,
    allergens: ['gluten', 'dairy', 'eggs'],
  },
  {
    id: 'm8',
    name: 'Lobster Linguine',
    description: 'Fresh lobster, cherry tomatoes, white wine garlic sauce',
    price: 48.00,
    category: 'mains',
    available: true,
    prepTimeMinutes: 18,
    allergens: ['seafood', 'gluten', 'dairy'],
  },
  {
    id: 'm9',
    name: 'Vegetarian Risotto',
    description: 'Arborio rice, seasonal vegetables, parmesan, truffle oil',
    price: 22.00,
    category: 'mains',
    available: true,
    prepTimeMinutes: 25,
    allergens: ['dairy'],
  },
  {
    id: 'm10',
    name: 'Lamb Chops',
    description: 'Grilled New Zealand lamb, mint chimichurri, rosemary potatoes',
    price: 46.00,
    category: 'mains',
    available: false,
    prepTimeMinutes: 30,
    allergens: [],
  },

  // Desserts
  {
    id: 'm11',
    name: 'Tiramisu',
    description: 'Classic Italian, espresso-soaked ladyfingers, mascarpone',
    price: 10.00,
    category: 'desserts',
    available: true,
    prepTimeMinutes: 5,
    allergens: ['dairy', 'eggs', 'gluten'],
  },
  {
    id: 'm12',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake, molten center, vanilla bean ice cream',
    price: 12.00,
    category: 'desserts',
    available: true,
    prepTimeMinutes: 12,
    allergens: ['dairy', 'eggs', 'gluten'],
  },
  {
    id: 'm13',
    name: 'Crème Brûlée',
    description: 'Vanilla custard, caramelized sugar, fresh berries',
    price: 9.00,
    category: 'desserts',
    available: true,
    prepTimeMinutes: 5,
    allergens: ['dairy', 'eggs'],
  },
  {
    id: 'm14',
    name: 'Gelato Selection',
    description: 'Three scoops: pistachio, stracciatella, hazelnut',
    price: 8.00,
    category: 'desserts',
    available: true,
    prepTimeMinutes: 3,
    allergens: ['dairy', 'nuts'],
  },

  // Drinks
  {
    id: 'm15',
    name: 'House Red Wine',
    description: 'Cabernet Sauvignon, glass',
    price: 12.00,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 1,
    allergens: ['sulfites'],
  },
  {
    id: 'm16',
    name: 'House White Wine',
    description: 'Chardonnay, glass',
    price: 11.00,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 1,
    allergens: ['sulfites'],
  },
  {
    id: 'm17',
    name: 'Craft Beer',
    description: 'Local IPA or seasonal lager',
    price: 8.00,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 1,
    allergens: ['gluten'],
  },
  {
    id: 'm18',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed, mint',
    price: 5.00,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 2,
    allergens: [],
  },
  {
    id: 'm19',
    name: 'Espresso',
    description: 'Double shot, Italian roast',
    price: 3.50,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 2,
    allergens: [],
  },
  {
    id: 'm20',
    name: 'Cappuccino',
    description: 'Espresso, steamed milk, foam',
    price: 5.00,
    category: 'drinks',
    available: true,
    prepTimeMinutes: 3,
    allergens: ['dairy'],
  },

  // Specials
  {
    id: 'm21',
    name: 'Chef\'s Tasting Menu',
    description: '5-course seasonal tasting with wine pairing',
    price: 85.00,
    category: 'specials',
    available: true,
    prepTimeMinutes: 60,
    allergens: ['dairy', 'gluten', 'seafood', 'nuts'],
  },
  {
    id: 'm22',
    name: 'Wagyu Beef Burger',
    description: 'A5 Wagyu, truffle aioli, aged cheddar, brioche bun, fries',
    price: 32.00,
    category: 'specials',
    available: true,
    prepTimeMinutes: 15,
    allergens: ['dairy', 'gluten', 'eggs'],
  },
];

export const MOCK_CHEFS: Chef[] = [
  // HEAD CHEF - Kitchen Leader
  {
    id: 'c1',
    name: 'Marco Rossi',
    chefRole: 'head_chef',
    station: 'expediting',
    specialties: ['mains', 'specials', 'appetizers', 'desserts'],
    activeOrders: 0,
    maxConcurrentOrders: 99, // Head chef doesn't cook, manages
    isAvailable: true,
  },
  // LINE CHEFS - Station Chefs
  {
    id: 'c2',
    name: 'Sarah Chen',
    chefRole: 'line_chef',
    station: 'grill',
    specialties: ['mains'],
    activeOrders: 1,
    maxConcurrentOrders: 4,
    isAvailable: true,
  },
  {
    id: 'c3',
    name: 'Pierre Dubois',
    chefRole: 'line_chef',
    station: 'pastry',
    specialties: ['desserts', 'appetizers'],
    activeOrders: 0,
    maxConcurrentOrders: 3,
    isAvailable: true,
  },
  {
    id: 'c4',
    name: 'James Wilson',
    chefRole: 'line_chef',
    station: 'saute',
    specialties: ['mains', 'specials'],
    activeOrders: 1,
    maxConcurrentOrders: 4,
    isAvailable: true,
  },
  {
    id: 'c5',
    name: 'Ahmed Hassan',
    chefRole: 'line_chef',
    station: 'cold',
    specialties: ['appetizers', 'desserts'],
    activeOrders: 0,
    maxConcurrentOrders: 3,
    isAvailable: true,
  },
  {
    id: 'c6',
    name: 'Fatima Al-Zahra',
    chefRole: 'sous_chef',
    station: 'expediting',
    specialties: ['mains', 'specials', 'appetizers'],
    activeOrders: 0,
    maxConcurrentOrders: 4,
    isAvailable: true,
  },
];

export const MOCK_TABLES: Table[] = [
  { id: 't1', number: '1', capacity: 2, status: 'occupied', currentOrderId: 'ord-001' },
  { id: 't2', number: '2', capacity: 4, status: 'occupied', currentOrderId: 'ord-002' },
  { id: 't3', number: '3', capacity: 2, status: 'free' },
  { id: 't4', number: '4', capacity: 6, status: 'occupied', currentOrderId: 'ord-003' },
  { id: 't5', number: '5', capacity: 4, status: 'free' },
  { id: 't6', number: '6', capacity: 2, status: 'reserved' },
  { id: 't7', number: '7', capacity: 4, status: 'occupied', currentOrderId: 'ord-004' },
  { id: 't8', number: '8', capacity: 2, status: 'free' },
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmed Hassan', role: 'owner', email: 'ahmed@restaurant.com' },
  // Head Chef
  { id: 'u2', name: 'Marco Rossi', role: 'head_chef', email: 'marco@restaurant.com' },
  // Line Chefs
  { id: 'u3', name: 'Sarah Chen', role: 'line_chef', email: 'sarah@restaurant.com' },
  { id: 'u4', name: 'Pierre Dubois', role: 'line_chef', email: 'pierre@restaurant.com' },
  { id: 'u5', name: 'James Wilson', role: 'line_chef', email: 'james@restaurant.com' },
  { id: 'u11', name: 'Ahmed Hassan Jr.', role: 'line_chef', email: 'ahmed.jr@restaurant.com' },
  { id: 'u12', name: 'Fatima Al-Zahra', role: 'sous_chef', email: 'fatima.chef@restaurant.com' },
  // Servers
  { id: 'u6', name: 'Fatima Ali', role: 'server', email: 'fatima@restaurant.com' },
  { id: 'u7', name: 'Omar Khaled', role: 'server', email: 'omar@restaurant.com' },
  { id: 'u8', name: 'Yasmin Ahmed', role: 'server', email: 'yasmin@restaurant.com' },
  // Customers
  { id: 'u9', name: 'Customer John', role: 'customer', email: 'john@email.com' },
  { id: 'u10', name: 'Customer Sarah', role: 'customer', email: 'sarah@email.com' },
];

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000);
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60 * 1000);

function createOrderItem(menuItem: MenuItem, quantity: number, status: Order['status'] = 'pending', specialInstructions?: string): Order['items'][0] {
  return {
    id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    menuItemId: menuItem.id,
    menuItem,
    quantity,
    unitPrice: menuItem.price,
    totalPrice: menuItem.price * quantity,
    status,
    specialInstructions,
  };
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-001',
    customerId: 'u9',
    customerName: 'John Smith',
    tableNumber: '1',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm5')!, 1, 'cooking', 'Medium rare'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm15')!, 1, 'delivered'),
    ],
    status: 'cooking',
    subtotal: 54.00,
    tax: 5.40,
    total: 59.40,
    paymentStatus: 'pending',
    createdAt: minutesAgo(15),
    updatedAt: minutesAgo(5),
    assignedServerId: 'u6',
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-002',
    customerId: 'u10',
    customerName: 'Sarah Johnson',
    tableNumber: '2',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm2')!, 1, 'prepared'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm7')!, 1, 'cooking'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm18')!, 2, 'delivered'),
    ],
    status: 'cooking',
    subtotal: 61.00,
    tax: 6.10,
    total: 67.10,
    paymentStatus: 'pending',
    createdAt: minutesAgo(20),
    updatedAt: minutesAgo(8),
    assignedServerId: 'u7',
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-003',
    customerId: 'u9',
    customerName: 'John Smith',
    tableNumber: '4',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm1')!, 1, 'delivered'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm8')!, 1, 'assigned'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm16')!, 1, 'delivered'),
    ],
    status: 'assigned',
    subtotal: 94.00,
    tax: 9.40,
    total: 103.40,
    paymentStatus: 'pending',
    createdAt: minutesAgo(10),
    updatedAt: minutesAgo(2),
    assignedServerId: 'u8',
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-004',
    customerId: 'u10',
    customerName: 'Sarah Johnson',
    tableNumber: '7',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm3')!, 1, 'pending'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm21')!, 1, 'pending'),
    ],
    status: 'pending',
    subtotal: 101.00,
    tax: 10.10,
    total: 111.10,
    paymentStatus: 'pending',
    createdAt: minutesAgo(5),
    updatedAt: minutesAgo(5),
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-005',
    customerId: 'u9',
    customerName: 'John Smith',
    tableNumber: '1',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm11')!, 1, 'completed'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm19')!, 1, 'completed'),
    ],
    status: 'completed',
    subtotal: 13.50,
    tax: 1.35,
    total: 14.85,
    paymentStatus: 'paid',
    createdAt: hoursAgo(2),
    updatedAt: hoursAgo(1),
    completedAt: hoursAgo(1),
    assignedServerId: 'u6',
  },
  {
    id: 'ord-006',
    orderNumber: 'ORD-006',
    customerId: 'u10',
    customerName: 'Sarah Johnson',
    tableNumber: '2',
    items: [
      createOrderItem(MOCK_MENU.find(m => m.id === 'm12')!, 1, 'completed'),
      createOrderItem(MOCK_MENU.find(m => m.id === 'm20')!, 1, 'completed'),
    ],
    status: 'completed',
    subtotal: 17.00,
    tax: 1.70,
    total: 18.70,
    paymentStatus: 'paid',
    createdAt: hoursAgo(3),
    updatedAt: hoursAgo(2),
    completedAt: hoursAgo(2),
    assignedServerId: 'u7',
  },
];

export const MOCK_DAILY_REPORT: DailyReport = {
  date: new Date().toISOString().split('T')[0],
  totalOrders: 24,
  completedOrders: 18,
  cancelledOrders: 2,
  totalRevenue: 2847.50,
  totalTax: 284.75,
  averageOrderValue: 118.65,
  topSellingItems: [
    { menuItemId: 'm5', name: 'Ribeye Steak', count: 8, revenue: 336.00 },
    { menuItemId: 'm7', name: 'Chicken Parmesan', count: 12, revenue: 312.00 },
    { menuItemId: 'm11', name: 'Tiramisu', count: 15, revenue: 150.00 },
    { menuItemId: 'm15', name: 'House Red Wine', count: 20, revenue: 240.00 },
    { menuItemId: 'm2', name: 'Bruschetta Trio', count: 10, revenue: 100.00 },
  ],
  ordersByHour: [
    { hour: 11, count: 2, revenue: 180.00 },
    { hour: 12, count: 5, revenue: 520.00 },
    { hour: 13, count: 8, revenue: 890.00 },
    { hour: 14, count: 4, revenue: 410.00 },
    { hour: 15, count: 1, revenue: 85.00 },
    { hour: 18, count: 2, revenue: 220.00 },
    { hour: 19, count: 6, revenue: 640.00 },
    { hour: 20, count: 4, revenue: 480.00 },
    { hour: 21, count: 3, revenue: 320.00 },
  ],
  ordersByCategory: [
    { category: 'mains', count: 45, revenue: 1450.00 },
    { category: 'appetizers', count: 28, revenue: 280.00 },
    { category: 'desserts', count: 22, revenue: 198.00 },
    { category: 'drinks', count: 35, revenue: 380.00 },
    { category: 'specials', count: 5, revenue: 420.00 },
  ],
  serverPerformance: [
    { serverId: 'u6', name: 'Fatima Ali', ordersDelivered: 12, tips: 180.00 },
    { serverId: 'u7', name: 'Omar Khaled', ordersDelivered: 9, tips: 145.00 },
    { serverId: 'u8', name: 'Yasmin Ahmed', ordersDelivered: 7, tips: 95.00 },
  ],
  chefPerformance: [
    { chefId: 'c1', name: 'Chef Marco Rossi', ordersCooked: 15, avgTimeMinutes: 18 },
    { chefId: 'c2', name: 'Chef Sarah Chen', ordersCooked: 12, avgTimeMinutes: 16 },
    { chefId: 'c3', name: 'Chef Pierre Dubois', ordersCooked: 8, avgTimeMinutes: 12 },
    { chefId: 'c4', name: 'Chef James Wilson', ordersCooked: 10, avgTimeMinutes: 20 },
  ],
};

export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return MOCK_MENU.filter(item => item.category === category && item.available);
}

export function getMenuItem(id: string): MenuItem | undefined {
  return MOCK_MENU.find(item => item.id === id);
}

export function getOrdersByStatus(status: Order['status']): Order[] {
  return MOCK_ORDERS.filter(order => order.status === status);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return MOCK_ORDERS.filter(order => order.customerId === customerId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getOrdersByServer(serverId: string): Order[] {
  return MOCK_ORDERS.filter(order => order.assignedServerId === serverId);
}

export function getOrdersByChef(chefId: string): Order[] {
  return MOCK_ORDERS.filter(order => 
    order.items.some(item => item.assignedChefId === chefId)
  );
}

export function getAvailableChefs(category?: MenuCategory): Chef[] {
  let chefs = MOCK_CHEFS.filter(c => c.isAvailable && c.activeOrders < c.maxConcurrentOrders);
  if (category) {
    chefs = chefs.filter(c => c.specialties.includes(category));
  }
  return chefs.sort((a, b) => a.activeOrders - b.activeOrders);
}

export const MOCK_CATEGORIES = [
  { value: 'appetizers', label: 'Appetizers', icon: '🥗' },
  { value: 'mains', label: 'Main Courses', icon: '🍖' },
  { value: 'desserts', label: 'Desserts', icon: '🍰' },
  { value: 'drinks', label: 'Drinks', icon: '🥤' },
  { value: 'specials', label: 'Chef Specials', icon: '⭐' },
] as const;