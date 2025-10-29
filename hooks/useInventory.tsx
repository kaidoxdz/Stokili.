import React, { createContext, useContext, useState, ReactNode } from 'react';
// FIX: Import User and Settings types to be used in the provider.
import { Product, Order, OrderStatus, InventoryContextType, User, Settings } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'T-Shirt en Coton Bio', sku: 'TS-CB-M-BLK', category: 'Vêtements', price: 29.99, stock: 150, imageUrl: 'https://picsum.photos/seed/p1/400/400' },
  { id: 'p2', name: 'Tasse à Café Isotherme', sku: 'TC-ISO-500-BLU', category: 'Accessoires', price: 24.50, stock: 80, imageUrl: 'https://picsum.photos/seed/p2/400/400' },
  { id: 'p3', name: 'Casque Audio Bluetooth', sku: 'CA-BT-NC-GRY', category: 'Électronique', price: 199.00, stock: 45, imageUrl: 'https://picsum.photos/seed/p3/400/400' },
  { id: 'p4', name: 'Sac à Dos Urbain', sku: 'SD-URB-25L-GRN', category: 'Sacs', price: 75.00, stock: 15, imageUrl: 'https://picsum.photos/seed/p4/400/400' },
  { id: 'p5', name: 'Gourde Inox 1L', sku: 'GD-INOX-1L-SLV', category: 'Accessoires', price: 19.90, stock: 200, imageUrl: 'https://picsum.photos/seed/p5/400/400' },
  { id: 'p6', name: 'Carnet de Notes Premium', sku: 'CN-PREM-A5-BRW', category: 'Papeterie', price: 15.00, stock: 8, imageUrl: 'https://picsum.photos/seed/p6/400/400' },
];

const MOCK_ORDERS: Order[] = [
  { id: 'o1', customerName: 'Alice Martin', date: '2024-07-20T10:30:00Z', status: OrderStatus.Delivered, items: [{ productId: 'p1', quantity: 2, price: 29.99 }, { productId: 'p2', quantity: 1, price: 24.50 }], total: 84.48 },
  { id: 'o2', customerName: 'Bob Dubois', date: '2024-07-21T14:00:00Z', status: OrderStatus.Shipped, items: [{ productId: 'p3', quantity: 1, price: 199.00 }], total: 199.00 },
  { id: 'o3', customerName: 'Claire Petit', date: '2024-07-22T09:15:00Z', status: OrderStatus.Processing, items: [{ productId: 'p4', quantity: 1, price: 75.00 }, { productId: 'p5', quantity: 2, price: 19.90 }], total: 114.80 },
  { id: 'o4', customerName: 'David Garcia', date: '2024-07-22T11:45:00Z', status: OrderStatus.Pending, items: [{ productId: 'p6', quantity: 3, price: 15.00 }], total: 45.00 },
  { id: 'o5', customerName: 'Eva Lambert', date: '2024-07-20T18:00:00Z', status: OrderStatus.Cancelled, items: [{ productId: 'p1', quantity: 1, price: 29.99 }], total: 29.99 },
];

// FIX: Add mock data for user and settings for the profile page.
const MOCK_USER: User = {
  id: 'u1',
  name: 'Alexandre Dubois',
  email: 'alex.dubois@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  role: 'Administrateur',
};

const MOCK_SETTINGS: Settings = {
  theme: 'light',
  notifications: {
    lowStock: true,
    weeklySummary: false,
  },
};


const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  // FIX: Add state for user and settings.
  const [user, setUser] = useState<User>(MOCK_USER);
  const [settings, setSettings] = useState<Settings>(MOCK_SETTINGS);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: `p${Date.now()}` };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'total'>) => {
    const total = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder: Order = { ...orderData, id: `o${Date.now()}`, total };
    setOrders(prev => [newOrder, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const updateOrder = (updatedOrder: Order) => {
    const total = updatedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalOrder = { ...updatedOrder, total };
    setOrders(prev => prev.map(o => o.id === finalOrder.id ? finalOrder : o));
  };
  
  const deleteOrder = (orderId: string) => {
      setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };
  
  // FIX: Implement functions to update user and settings.
  const updateUser = (updatedUserData: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  const updateSettings = (updatedSettingsData: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updatedSettingsData }));
  };

  return (
    // FIX: Provide new user/settings state and update functions through the context.
    <InventoryContext.Provider value={{ products, orders, addProduct, updateProduct, deleteProduct, addOrder, updateOrder, deleteOrder, updateOrderStatus, getProductById, user, settings, updateUser, updateSettings }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
