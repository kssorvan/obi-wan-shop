
// This Product type is based on the original fashion app and current ProductCard component.
// It will need to be reconciled with the new motorcycle database schema.
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string; // This might become categoryId or a Category object
  imageUrl: string;
  dataAiHint?: string;
  rating?: number | null; // Allow null for rating
  reviewsCount?: number | null; // Allow null
  colors?: string[];
  sizes?: string[];
  stock?: number | null; // Allow null
  tags?: string[];
}

// Minimal type for Motorcycle Product from the new SQL schema for initial API integration
// This can be expanded as we integrate more deeply.
export interface MotorcycleProductDBSchema {
  product_id: number; // In SQL schema, it's INT UNSIGNED AUTO_INCREMENT
  name: string;
  description: string | null;
  price: number; // In SQL schema, it's DECIMAL(10, 2)
  original_price: number | null;
  stock: number; // In SQL schema, it's INT UNSIGNED
  category_id: number | null;
  image_url: string | null;
  public_id: string | null;
  featured: boolean | null;
  promotion_type: 'featured' | 'big_sale' | 'weekly_deal' | 'new_arrival' | 'none' | null;
  promotion_expiry: Date | null;
  is_deleted: boolean | null;
  created_at: Date;
  updated_at: Date;
  // Related data (example, actual structure depends on Prisma schema)
  categories?: { category_name: string } | null;
}

export interface Category {
  id: string; // Or number, depending on API response
  name: string;
  slug: string; // For generating links, e.g., /shop/categories/electronics
  description?: string | null;
  image_url?: string | null; // URL for the category image
  dataAiHint?: string | null; // For AI image suggestions for the category image
  // products_count?: number; // Optional: if API provides this
}


export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin' | 'superuser'; // Added role
  purchaseHistory?: Array<{ productId: string; name: string; date: string; price: number }>;
  browsingHistory?: Array<{ productId: string; name: string; viewedAt: string }>;
  // Fields from your new 'users' SQL table could be added here:
  // phone?: string;
  // address?: string;
  // profile_image_url?: string;
  // last_login?: Date;
}

export interface Address {
  id: string;
  fullName: string;
  streetAddress: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  trackingNumber?: string;
}

// Types related to the new motorcycle schema can be added here as needed
// e.g., MotorcycleBrand, MotorcycleSpec, etc.
// For now, keeping it minimal to get the API communication working.

// Admin Specific Types
export interface AdminProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Published' | 'Draft' | 'Archived';
  createdAt: string;
  imageUrl?: string; // Optional for table view
  dataAiHint?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superuser';
  joinedDate: string;
  lastLogin?: string;
  avatarUrl?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  itemCount: number;
}

export interface AdminSiteSettings {
  siteName: string;
  supportEmail: string;
  maintenanceMode: boolean;
}

export interface AdminPaymentSettings {
  stripeApiKey: string;
  paypalClientId: string;
  enablePaypal: boolean;
}

export interface AdminShippingSettings {
  defaultShippingRate: number;
  freeShippingThreshold: number;
}

