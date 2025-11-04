-- =====================================================
-- Travel Products Database Schema
-- =====================================================

-- Drop tables in reverse order of dependencies (if they exist)
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS travel_products CASCADE;
DROP TABLE IF EXISTS people CASCADE;

-- =====================================================
-- People Table
-- =====================================================
CREATE TABLE people (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  seed_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for faster lookups
CREATE INDEX idx_people_username ON people(username);
CREATE INDEX idx_people_email ON people(email);
CREATE INDEX idx_people_seed_data ON people(seed_data);

-- =====================================================
-- Travel Products Table
-- =====================================================
CREATE TABLE travel_products (
  id SERIAL PRIMARY KEY,
  temp_ref_id VARCHAR(255),
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  price DECIMAL(10, 2),
  duration VARCHAR(100),
  owner_id INTEGER REFERENCES people(id) ON DELETE SET NULL,
  seed_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster lookups
CREATE INDEX idx_travel_products_temp_ref_id ON travel_products(temp_ref_id);
CREATE INDEX idx_travel_products_owner_id ON travel_products(owner_id);
CREATE INDEX idx_travel_products_seed_data ON travel_products(seed_data);
CREATE INDEX idx_travel_products_location ON travel_products(location);
CREATE INDEX idx_travel_products_price ON travel_products(price);

-- =====================================================
-- Product Images Table
-- =====================================================
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  temp_ref_id VARCHAR(255),
  url TEXT NOT NULL,
  travel_product_id INTEGER REFERENCES travel_products(id) ON DELETE CASCADE,
  owner_id INTEGER REFERENCES people(id) ON DELETE SET NULL,
  seed_data BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster lookups
CREATE INDEX idx_product_images_temp_ref_id ON product_images(temp_ref_id);
CREATE INDEX idx_product_images_travel_product_id ON product_images(travel_product_id);
CREATE INDEX idx_product_images_owner_id ON product_images(owner_id);
CREATE INDEX idx_product_images_seed_data ON product_images(seed_data);

-- =====================================================
-- Triggers for updated_at timestamps
-- =====================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for people table
CREATE TRIGGER update_people_updated_at
  BEFORE UPDATE ON people
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for travel_products table
CREATE TRIGGER update_travel_products_updated_at
  BEFORE UPDATE ON travel_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_images table
CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Comments for documentation
-- =====================================================
-- caduwcvcvpdtflqfylqw
-- npx supabase link --project-ref caduwcvcvpdtflqfylqw
COMMENT ON TABLE people IS 'Stores user information for travel product owners';
COMMENT ON TABLE travel_products IS 'Main table for travel products/destinations';
COMMENT ON TABLE product_images IS 'Stores multiple images for each travel product';

COMMENT ON COLUMN people.seed_data IS 'Flag to identify seed data for easy cleanup';
COMMENT ON COLUMN travel_products.seed_data IS 'Flag to identify seed data for easy cleanup';
COMMENT ON COLUMN product_images.seed_data IS 'Flag to identify seed data for easy cleanup';

COMMENT ON COLUMN travel_products.temp_ref_id IS 'Temporary reference ID used during seeding to link related records';
COMMENT ON COLUMN product_images.temp_ref_id IS 'Temporary reference ID used during seeding to link to travel products';

COMMENT ON COLUMN travel_products.price IS 'Price in USD';
COMMENT ON COLUMN travel_products.duration IS 'Trip duration (e.g., "7 days", "2 weeks")';