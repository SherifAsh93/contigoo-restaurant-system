export type UserRole = 'owner' | 'head_chef' | 'line_chef' | 'sous_chef' | 'server' | 'customer';

export type ChefRole = 'head_chef' | 'line_chef' | 'sous_chef';

export type OrderStatus = 
  | 'pending'      // Order placed, waiting for kitchen
  | 'assigned'     // Assigned to a chef
  | 'cooking'      // Chef started cooking
  | 'cooked'       // Cooking complete
  | 'prepared'     // Plated and ready for pickup
  | 'delivering'   // Server picked up, en route
  | 'delivered'    // Delivered to customer
  | 'completed'    // Customer confirmed, payment done
  | 'cancelled';   // Cancelled

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  avatar?: string;
  assignedChefId?: string; // For servers assigned to specific chef
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  available: boolean;
  prepTimeMinutes: number;
  allergens: string[];
}

export type MenuCategory = 
  | 'appetizers' 
  | 'mains' 
  | 'desserts' 
  | 'drinks' 
  | 'specials';

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
  specialInstructions?: string;
  assignedChefId?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  tableNumber?: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  assignedServerId?: string;
  specialInstructions?: string;
}

export interface Chef {
  id: string;
  name: string;
  chefRole: ChefRole;
  station?: string; // e.g., 'grill', 'saute', 'pastry', 'cold'
  specialties: MenuCategory[];
  activeOrders: number;
  maxConcurrentOrders: number;
  isAvailable: boolean;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'free' | 'occupied' | 'reserved';
  currentOrderId?: string;
}

export interface DailyReport {
  date: string;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalTax: number;
  averageOrderValue: number;
  topSellingItems: { menuItemId: string; name: string; count: number; revenue: number }[];
  ordersByHour: { hour: number; count: number; revenue: number }[];
  ordersByCategory: { category: MenuCategory; count: number; revenue: number }[];
  serverPerformance: { serverId: string; name: string; ordersDelivered: number; tips: number }[];
  chefPerformance: { chefId: string; name: string; ordersCooked: number; avgTimeMinutes: number }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order_created' | 'order_assigned' | 'order_ready' | 'order_delivered' | 'payment_received';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedOrderId?: string;
}

export const MENU_CATEGORIES: { value: MenuCategory; label: string; icon: string }[] = [
  { value: 'appetizers', label: 'Appetizers', icon: '🥗' },
  { value: 'mains', label: 'Main Courses', icon: '🍖' },
  { value: 'desserts', label: 'Desserts', icon: '🍰' },
  { value: 'drinks', label: 'Drinks', icon: '🥤' },
  { value: 'specials', label: 'Chef Specials', icon: '⭐' },
];

export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bgColor: string; step: number }> = {
  pending: { label: 'Pending', color: '#f59e0b', bgColor: '#fffbeb', step: 1 },
  assigned: { label: 'Assigned', color: '#3b82f6', bgColor: '#eff6ff', step: 2 },
  cooking: { label: 'Cooking', color: '#f97316', bgColor: '#fff7ed', step: 3 },
  cooked: { label: 'Cooked', color: '#8b5cf6', bgColor: '#f5f3ff', step: 4 },
  prepared: { label: 'Prepared', color: '#06b6d4', bgColor: '#f0fdfa', step: 5 },
  delivering: { label: 'Delivering', color: '#6366f1', bgColor: '#eef2ff', step: 6 },
  delivered: { label: 'Delivered', color: '#10b981', bgColor: '#f0fdf4', step: 7 },
  completed: { label: 'Completed', color: '#059669', bgColor: '#ecfdf5', step: 8 },
  cancelled: { label: 'Cancelled', color: '#ef4444', bgColor: '#fef2f2', step: 0 },
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  owner: ['view_all', 'manage_menu', 'manage_staff', 'view_reports', 'manage_settings', 'view_financials'],
  head_chef: ['view_kitchen', 'manage_all_orders', 'assign_orders', 'view_reports', 'manage_station'],
  line_chef: ['view_assigned_orders', 'update_cooking_status', 'mark_cooked', 'mark_prepared'],
  sous_chef: ['view_kitchen', 'manage_all_orders', 'assign_orders', 'view_reports', 'manage_station'],
  server: ['view_assigned_orders', 'pickup_orders', 'deliver_orders', 'view_table_status'],
  customer: ['view_menu', 'place_order', 'view_own_orders', 'add_comments', 'make_payment'],
};