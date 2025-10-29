export enum OrderStatus {
  Pending = 'En attente',
  Processing = 'En traitement',
  Shipped = 'Expédiée',
  Delivered = 'Livrée',
  Cancelled = 'Annulée',
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
}

// FIX: Add User interface for the profile page.
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

// FIX: Add Settings interface for the profile page.
export interface Settings {
  theme: 'light' | 'dark';
  notifications: {
    lowStock: boolean;
    weeklySummary: boolean;
  };
}

export type InventoryContextType = {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'total'>) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getProductById: (productId: string) => Product | undefined;
  // FIX: Add user, settings, and their update functions to the context type.
  user: User;
  settings: Settings;
  updateUser: (user: Partial<User>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
};
