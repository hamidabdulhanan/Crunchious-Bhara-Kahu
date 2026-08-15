export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
}

export interface MenuItemSize {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  gallery: string[];
  sizes: MenuItemSize[];
  is_bestseller: boolean;
  status: string;
  ingredients: string | null;
  sort_order: number;
  category?: MenuCategory;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_order: number;
  expiry_date: string | null;
  active: boolean;
}

export interface RestaurantTable {
  id: string;
  table_number: number;
  seats: number;
  status: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string | null;
  notes: string | null;
  order_type: 'delivery' | 'dine-in';
  table_number: number | null;
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  coupon_code: string | null;
  payment_method: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  quantity: number;
  price: number;
  size: string | null;
  toppings: string[];
}

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  approved: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  photo: string | null;
  bio: string | null;
  sort_order: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  toppings: Topping[];
  image: string | null;
}
