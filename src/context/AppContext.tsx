'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { 
  Order, 
  MenuItem, 
  Chef, 
  Table, 
  User, 
  DailyReport, 
  OrderStatus, 
  UserRole,
  Notification 
} from '@/types';
import { 
  MOCK_ORDERS, 
  MOCK_MENU, 
  MOCK_CHEFS, 
  MOCK_TABLES, 
  MOCK_USERS, 
  MOCK_DAILY_REPORT,
  getAvailableChefs,
  getMenuItem 
} from '@/lib/mockData';

interface AppState {
  currentUser: User | null;
  orders: Order[];
  menu: MenuItem[];
  chefs: Chef[];
  tables: Table[];
  users: User[];
  dailyReport: DailyReport;
  notifications: Notification[];
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'UPDATE_ORDER'; payload: Order }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_ITEM_STATUS'; payload: { orderId: string; itemId: string; status: OrderStatus; chefId?: string } }
  | { type: 'ASSIGN_CHEF'; payload: { orderId: string; itemId: string; chefId: string } }
  | { type: 'UPDATE_CHEF'; payload: Chef }
  | { type: 'UPDATE_TABLE'; payload: Table }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  currentUser: null,
  orders: MOCK_ORDERS,
  menu: MOCK_MENU,
  chefs: MOCK_CHEFS,
  tables: MOCK_TABLES,
  users: MOCK_USERS,
  dailyReport: MOCK_DAILY_REPORT,
  notifications: [],
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_ORDERS':
      return { ...state, orders: action.payload };

    case 'UPDATE_ORDER': {
      const updatedOrders = state.orders.map(order => 
        order.id === action.payload.id ? action.payload : order
      );
      return { ...state, orders: updatedOrders };
    }

    case 'ADD_ORDER': {
      return { ...state, orders: [action.payload, ...state.orders] };
    }

    case 'UPDATE_ORDER_ITEM_STATUS': {
      const { orderId, itemId, status, chefId } = action.payload;
      const updatedOrders = state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => {
            if (item.id !== itemId) return item;
            const updatedItem = { ...item, status };
            if (chefId) updatedItem.assignedChefId = chefId;
            if (status === 'cooking' && !item.startedAt) updatedItem.startedAt = new Date();
            if (status === 'cooked' || status === 'prepared') updatedItem.completedAt = new Date();
            return updatedItem;
          }),
          updatedAt: new Date(),
          status: calculateOrderStatus(
            order.items.map(item => item.id === itemId ? { ...item, status } : item)
          ),
        };
      });
      return { ...state, orders: updatedOrders };
    }

    case 'ASSIGN_CHEF': {
      const { orderId, itemId, chefId } = action.payload;
      const updatedOrders = state.orders.map(order => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          items: order.items.map(item => 
            item.id === itemId ? { ...item, assignedChefId: chefId, status: 'assigned' as OrderStatus } : item
          ),
          updatedAt: new Date(),
        };
      });
      const updatedChefs = state.chefs.map(chef => 
        chef.id === chefId ? { ...chef, activeOrders: chef.activeOrders + 1 } : chef
      );
      return { ...state, orders: updatedOrders, chefs: updatedChefs };
    }

    case 'UPDATE_CHEF': {
      const updatedChefs = state.chefs.map(chef => 
        chef.id === action.payload.id ? action.payload : chef
      );
      return { ...state, chefs: updatedChefs };
    }

    case 'UPDATE_TABLE': {
      const updatedTables = state.tables.map(table => 
        table.id === action.payload.id ? action.payload : table
      );
      return { ...state, tables: updatedTables };
    }

    case 'ADD_NOTIFICATION': {
      return { ...state, notifications: [action.payload, ...state.notifications] };
    }

    case 'MARK_NOTIFICATION_READ': {
      const updatedNotifications = state.notifications.map(n => 
        n.id === action.payload ? { ...n, read: true } : n
      );
      return { ...state, notifications: updatedNotifications };
    }

    case 'UPDATE_MENU_ITEM': {
      const updatedMenu = state.menu.map(item => 
        item.id === action.payload.id ? action.payload : item
      );
      return { ...state, menu: updatedMenu };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

function calculateOrderStatus(items: Order['items']): OrderStatus {
  const statuses = items.map(i => i.status);
  if (statuses.every(s => s === 'completed')) return 'completed';
  if (statuses.every(s => s === 'delivered')) return 'delivered';
  if (statuses.some(s => s === 'delivering')) return 'delivering';
  if (statuses.every(s => s === 'prepared')) return 'prepared';
  if (statuses.every(s => s === 'cooked')) return 'cooked';
  if (statuses.some(s => s === 'cooking')) return 'cooking';
  if (statuses.some(s => s === 'assigned')) return 'assigned';
  if (statuses.some(s => s === 'cancelled')) return 'cancelled';
  return 'pending';
}

interface AppContextType extends AppState {
  login: (user: User) => void;
  logout: () => void;
  updateOrder: (order: Order) => void;
  addOrder: (order: Order) => void;
  updateOrderItemStatus: (orderId: string, itemId: string, status: OrderStatus, chefId?: string) => void;
  assignChefToItem: (orderId: string, itemId: string, chefId: string) => void;
  updateChef: (chef: Chef) => void;
  updateTable: (table: Table) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  updateMenuItem: (item: MenuItem) => void;
  getOrdersForRole: (role: UserRole, userId: string) => Order[];
  getAvailableChefsForCategory: (category: string) => Chef[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate chef progress on orders
      state.orders.forEach(order => {
        if (order.status === 'cooking' || order.status === 'assigned') {
          const cookingItems = order.items.filter(i => i.status === 'cooking');
          if (cookingItems.length > 0 && Math.random() < 0.1) {
            const item = cookingItems[Math.floor(Math.random() * cookingItems.length)];
            const nextStatuses: OrderStatus[] = ['cooked', 'prepared'];
            const nextStatus = nextStatuses[Math.floor(Math.random() * nextStatuses.length)];
            dispatch({ 
              type: 'UPDATE_ORDER_ITEM_STATUS', 
              payload: { orderId: order.id, itemId: item.id, status: nextStatus } 
            });
          }
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [state.orders]);

  const login = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'SET_USER', payload: null });
  }, []);

  const updateOrder = useCallback((order: Order) => {
    dispatch({ type: 'UPDATE_ORDER', payload: order });
  }, []);

  const addOrder = useCallback((order: Order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
    
    // Notify kitchen
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: {
        id: `notif-${Date.now()}`,
        userId: 'kitchen',
        type: 'order_created',
        title: 'New Order Received',
        message: `Order ${order.orderNumber} for Table ${order.tableNumber}`,
        read: false,
        createdAt: new Date(),
        relatedOrderId: order.id,
      }
    });
  }, []);

  const updateOrderItemStatus = useCallback((orderId: string, itemId: string, status: OrderStatus, chefId?: string) => {
    dispatch({ type: 'UPDATE_ORDER_ITEM_STATUS', payload: { orderId, itemId, status, chefId } });
  }, []);

  const assignChefToItem = useCallback((orderId: string, itemId: string, chefId: string) => {
    dispatch({ type: 'ASSIGN_CHEF', payload: { orderId, itemId, chefId } });
  }, []);

  const updateChef = useCallback((chef: Chef) => {
    dispatch({ type: 'UPDATE_CHEF', payload: chef });
  }, []);

  const updateTable = useCallback((table: Table) => {
    dispatch({ type: 'UPDATE_TABLE', payload: table });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt'>) => {
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        ...notification, 
        id: `notif-${Date.now()}`, 
        createdAt: new Date() 
      } 
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const updateMenuItem = useCallback((item: MenuItem) => {
    dispatch({ type: 'UPDATE_MENU_ITEM', payload: item });
  }, []);

  const getOrdersForRole = useCallback((role: UserRole, userId: string): Order[] => {
    switch (role) {
      case 'owner':
        return state.orders;
      case 'chef':
        return state.orders.filter(order => 
          order.items.some(item => item.assignedChefId === userId)
        );
      case 'server':
        return state.orders.filter(order => order.assignedServerId === userId);
      case 'customer':
        return state.orders.filter(order => order.customerId === userId);
      default:
        return [];
    }
  }, [state.orders]);

  const getAvailableChefsForCategory = useCallback((category: string): Chef[] => {
    return getAvailableChefs(category as any);
  }, []);

  const value: AppContextType = {
    ...state,
    login,
    logout,
    updateOrder,
    addOrder,
    updateOrderItemStatus,
    assignChefToItem,
    updateChef,
    updateTable,
    addNotification,
    markNotificationRead,
    updateMenuItem,
    getOrdersForRole,
    getAvailableChefsForCategory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}