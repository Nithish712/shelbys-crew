-- ============================================
-- Shelby's Crew Fruit Shop — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  unit        TEXT DEFAULT 'kg',
  image_url   TEXT,
  category    TEXT DEFAULT 'Fruits',
  is_available BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Combos
CREATE TABLE IF NOT EXISTS combos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  items       JSONB DEFAULT '[]',
  is_available BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text       TEXT NOT NULL,
  author     TEXT DEFAULT 'Tommy Shelby',
  is_active  BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos     ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes     ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (safe to re-run)
DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
DROP POLICY IF EXISTS "Public read combos"     ON combos;
DROP POLICY IF EXISTS "Public read quotes"     ON quotes;

-- Recreate policies
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public read combos"     ON combos     FOR SELECT USING (true);
CREATE POLICY "Public read quotes"     ON quotes     FOR SELECT USING (true);

-- Seed Quotes (only if table is empty)
INSERT INTO quotes (text, author, is_active)
SELECT * FROM (VALUES
  ('By order of the Peaky Blinders, only the finest fruits shall be served.', 'Tommy Shelby', TRUE),
  ('A man who does not enjoy fresh fruit has no soul.', 'Arthur Shelby', TRUE),
  ('Every morning is a chance to choose better. Choose fruit.', 'Polly Gray', TRUE),
  ('In this family, we eat well. Nature''s finest, no exceptions.', 'Tommy Shelby', TRUE),
  ('The sweetest victories come from the sweetest fruits.', 'John Shelby', TRUE)
) AS v(text, author, is_active)
WHERE NOT EXISTS (SELECT 1 FROM quotes LIMIT 1);

-- Seed Menu Items (only if table is empty)
INSERT INTO menu_items (name, description, price, unit, category, is_available)
SELECT * FROM (VALUES
  ('Alphonso Mango', 'King of fruits. Sweet, creamy, and rich.', 120::NUMERIC, 'kg', 'Seasonal', TRUE),
  ('Watermelon', 'Fresh and hydrating. Perfect for summer.', 25::NUMERIC, 'kg', 'Fruits', TRUE),
  ('Papaya', 'Ripe and naturally sweet. Rich in vitamins.', 40::NUMERIC, 'kg', 'Fruits', TRUE),
  ('Banana', 'Elakki or Robusta. Fresh daily stock.', 60::NUMERIC, 'dozen', 'Fruits', TRUE),
  ('Apple', 'Shimla Red Delicious. Crisp and juicy.', 180::NUMERIC, 'kg', 'Fruits', TRUE),
  ('Pomegranate', 'Rich red arils. Packed with antioxidants.', 150::NUMERIC, 'kg', 'Fruits', TRUE),
  ('Grapes', 'Seedless black or green grapes.', 90::NUMERIC, 'kg', 'Fruits', TRUE),
  ('Pineapple', 'Sweet and tangy. Fresh cut available.', 50::NUMERIC, 'piece', 'Fruits', TRUE)
) AS v(name, description, price, unit, category, is_available)
WHERE NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1);

-- Seed Combos (only if table is empty)
INSERT INTO combos (name, description, price, items, is_available)
SELECT * FROM (VALUES
  ('The Garrison Special', 'Mango + Pomegranate + Grapes — the boss combo.', 299::NUMERIC, '["Alphonso Mango 500g", "Pomegranate 500g", "Grapes 500g"]'::JSONB, TRUE),
  ('Shelby Morning Basket', 'Banana + Apple + Papaya — start the day right.', 199::NUMERIC, '["Banana 1 dozen", "Apple 500g", "Papaya 1 piece"]'::JSONB, TRUE),
  ('Summer Crew Pack', 'Watermelon + Pineapple + Grapes — beat the heat.', 149::NUMERIC, '["Watermelon 1kg", "Pineapple 1 piece", "Grapes 500g"]'::JSONB, TRUE)
) AS v(name, description, price, items, is_available)
WHERE NOT EXISTS (SELECT 1 FROM combos LIMIT 1);
