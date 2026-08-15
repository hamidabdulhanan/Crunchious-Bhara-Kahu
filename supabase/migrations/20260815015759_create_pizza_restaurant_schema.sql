/*
# Pizza Restaurant Database Schema

## Overview
Complete schema for a production pizza restaurant ordering system with menu, orders, reviews, contact messages, team members, coupons, and dine-in tables.

## New Tables

1. **menu_categories** — menu item categories (Crunchy Chicken, Pizzas, Pastas, etc.)
   - id, name, slug, image, sort_order, created_at

2. **menu_items** — individual menu products
   - id, category_id (FK), name, description, price, image, gallery (array), sizes (jsonb), is_bestseller, status, ingredients, sort_order, created_at

3. **toppings** — add-ons (extra cheese, extra chicken, etc.)
   - id, name, price, created_at

4. **coupons** — discount codes
   - id, code, discount_type (percentage/fixed), discount_value, minimum_order, expiry_date, active, created_at

5. **restaurant_tables** — dine-in tables for table-number ordering
   - id, table_number, seats, status, created_at

6. **orders** — customer orders
   - id, order_number, customer_name, phone, address, notes, order_type (delivery/dine-in), table_number, subtotal, discount, total, status, coupon_code, payment_method, created_at

7. **order_items** — line items per order
   - id, order_id (FK), menu_item_id, name, quantity, price, size, toppings (jsonb), created_at

8. **reviews** — customer reviews
   - id, customer_name, rating, review_text, approved, created_at

9. **contact_messages** — form submissions
   - id, name, phone, email, message, created_at

10. **team_members** — staff profiles
    - id, name, designation, photo, bio, sort_order, created_at

## Security (RLS)
- All tables have RLS enabled.
- Public read for menu_categories, menu_items, toppings, coupons, reviews (approved only), team_members, restaurant_tables.
- Public insert for orders, order_items, reviews, contact_messages (customers submit without login).
- Admin-only update/delete via authenticated role (admin manages through Supabase dashboard or authenticated admin UI).
- Orders are readable by anyone (order tracking by order number) — this is a public ordering system.
*/

-- Menu Categories
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  image text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image text,
  gallery text[] DEFAULT '{}',
  sizes jsonb DEFAULT '[]',
  is_bestseller boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'active',
  ingredients text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Toppings
CREATE TABLE IF NOT EXISTS toppings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric(10,2) NOT NULL DEFAULT 0,
  minimum_order numeric(10,2) DEFAULT 0,
  expiry_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Restaurant Tables (dine-in)
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number int NOT NULL UNIQUE,
  seats int NOT NULL DEFAULT 4,
  status text NOT NULL DEFAULT 'available',
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text,
  notes text,
  order_type text NOT NULL DEFAULT 'delivery',
  table_number int,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  coupon_code text,
  payment_method text NOT NULL DEFAULT 'cod',
  created_at timestamptz DEFAULT now()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid,
  name text NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL DEFAULT 0,
  size text,
  toppings jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  review_text text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Team Members
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  photo text,
  bio text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- menu_categories: public read, admin write
DROP POLICY IF EXISTS "public_read_menu_categories" ON menu_categories;
CREATE POLICY "public_read_menu_categories" ON menu_categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_menu_categories" ON menu_categories;
CREATE POLICY "auth_insert_menu_categories" ON menu_categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_menu_categories" ON menu_categories;
CREATE POLICY "auth_update_menu_categories" ON menu_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_menu_categories" ON menu_categories;
CREATE POLICY "auth_delete_menu_categories" ON menu_categories FOR DELETE
  TO authenticated USING (true);

-- menu_items: public read, admin write
DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_menu_items" ON menu_items;
CREATE POLICY "auth_insert_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_menu_items" ON menu_items;
CREATE POLICY "auth_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_menu_items" ON menu_items;
CREATE POLICY "auth_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- toppings: public read, admin write
DROP POLICY IF EXISTS "public_read_toppings" ON toppings;
CREATE POLICY "public_read_toppings" ON toppings FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_toppings" ON toppings;
CREATE POLICY "auth_insert_toppings" ON toppings FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_toppings" ON toppings;
CREATE POLICY "auth_update_toppings" ON toppings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_toppings" ON toppings;
CREATE POLICY "auth_delete_toppings" ON toppings FOR DELETE
  TO authenticated USING (true);

-- coupons: public read (so customers can apply), admin write
DROP POLICY IF EXISTS "public_read_coupons" ON coupons;
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_coupons" ON coupons;
CREATE POLICY "auth_insert_coupons" ON coupons FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_coupons" ON coupons;
CREATE POLICY "auth_update_coupons" ON coupons FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_coupons" ON coupons;
CREATE POLICY "auth_delete_coupons" ON coupons FOR DELETE
  TO authenticated USING (true);

-- restaurant_tables: public read, admin write
DROP POLICY IF EXISTS "public_read_restaurant_tables" ON restaurant_tables;
CREATE POLICY "public_read_restaurant_tables" ON restaurant_tables FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_restaurant_tables" ON restaurant_tables;
CREATE POLICY "auth_insert_restaurant_tables" ON restaurant_tables FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_restaurant_tables" ON restaurant_tables;
CREATE POLICY "auth_update_restaurant_tables" ON restaurant_tables FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_restaurant_tables" ON restaurant_tables;
CREATE POLICY "auth_delete_restaurant_tables" ON restaurant_tables FOR DELETE
  TO authenticated USING (true);

-- orders: public read (order tracking by order number), public insert (customers place orders), admin update/delete
DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- order_items: public read, public insert, admin update/delete
DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_order_items" ON order_items;
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- reviews: public read approved only, public insert (customers submit), admin update/delete
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (approved = true);
DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- contact_messages: public insert only (admin reads via authenticated)
DROP POLICY IF EXISTS "auth_read_contact_messages" ON contact_messages;
CREATE POLICY "auth_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_contact_messages" ON contact_messages;
CREATE POLICY "auth_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- team_members: public read, admin write
DROP POLICY IF EXISTS "public_read_team_members" ON team_members;
CREATE POLICY "public_read_team_members" ON team_members FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_team_members" ON team_members;
CREATE POLICY "auth_insert_team_members" ON team_members FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_team_members" ON team_members;
CREATE POLICY "auth_update_team_members" ON team_members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_team_members" ON team_members;
CREATE POLICY "auth_delete_team_members" ON team_members FOR DELETE
  TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_bestseller ON menu_items(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);
