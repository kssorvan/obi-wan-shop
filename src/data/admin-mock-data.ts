
import type { AdminProduct, AdminUser, AdminOrder } from '@/types';

export const mockAdminProducts: AdminProduct[] = [
  { id: 'prod_1', name: 'Premium Comfort Tee', category: 'Clothing', price: 39.99, stock: 150, status: 'Published', createdAt: '2024-07-01', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'tee shirt' },
  { id: 'prod_2', name: 'Urban Explorer Jeans', category: 'Clothing', price: 89.00, stock: 80, status: 'Published', createdAt: '2024-06-15', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'blue jeans'},
  { id: 'prod_3', name: 'City Runner Sneakers', category: 'Shoes', price: 130.00, stock: 0, status: 'Published', createdAt: '2024-05-20', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'sport shoes' },
  { id: 'prod_4', name: 'Artisan Leather Wallet', category: 'Accessories', price: 55.00, stock: 200, status: 'Draft', createdAt: '2024-07-10', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'brown wallet' },
  { id: 'prod_5', name: 'Winter Knit Beanie', category: 'Accessories', price: 25.00, stock: 300, status: 'Archived', createdAt: '2023-12-01', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'wool hat' },
  { id: 'prod_6', name: 'Performance Tech Hoodie', category: 'Clothing', price: 75.00, stock: 120, status: 'Published', createdAt: '2024-07-05', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'grey hoodie' },
];

export const mockAdminUsers: AdminUser[] = [
  { id: 'user_1', name: 'Alice Wonderland', email: 'alice@example.com', role: 'user', joinedDate: '2024-01-15', lastLogin: '2024-07-20', avatarUrl: 'https://avatar.vercel.sh/alice.png' },
  { id: 'user_2', name: 'Bob The Builder', email: 'bob@example.com', role: 'user', joinedDate: '2024-03-22', lastLogin: '2024-07-19', avatarUrl: 'https://avatar.vercel.sh/bob.png' },
  { id: 'user_3', name: 'Charlie Admin', email: 'charlie@example.com', role: 'admin', joinedDate: '2023-11-01', lastLogin: '2024-07-21', avatarUrl: 'https://avatar.vercel.sh/charlie.png' },
  { id: 'user_4', name: 'Diana Super', email: 'diana@example.com', role: 'superuser', joinedDate: '2023-09-10', lastLogin: '2024-07-21', avatarUrl: 'https://avatar.vercel.sh/diana.png' },
  { id: 'user_5', name: 'Eve Customer', email: 'eve@example.com', role: 'user', joinedDate: '2024-07-01', lastLogin: '2024-07-18', avatarUrl: 'https://avatar.vercel.sh/eve.png' },
];

export const mockAdminOrders: AdminOrder[] = [
  { id: 'ORD-001', customerName: 'Alice Wonderland', customerEmail: 'alice@example.com', date: '2024-07-18', total: 129.98, status: 'Delivered', itemCount: 2 },
  { id: 'ORD-002', customerName: 'Bob The Builder', customerEmail: 'bob@example.com', date: '2024-07-19', total: 89.00, status: 'Shipped', itemCount: 1 },
  { id: 'ORD-003', customerName: 'Eve Customer', customerEmail: 'eve@example.com', date: '2024-07-20', total: 255.50, status: 'Processing', itemCount: 3 },
  { id: 'ORD-004', customerName: 'Alice Wonderland', customerEmail: 'alice@example.com', date: '2024-07-21', total: 55.00, status: 'Pending', itemCount: 1 },
  { id: 'ORD-005', customerName: 'John Doe', customerEmail: 'john.doe@example.com', date: '2024-07-15', total: 75.00, status: 'Cancelled', itemCount: 1 },
];
