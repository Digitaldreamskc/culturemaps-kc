-- Add new fields to locations table
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS custom_icon_url TEXT,
ADD COLUMN IF NOT EXISTS category_icon_url TEXT;

-- Create an enum for location categories
CREATE TYPE location_category AS ENUM (
  'museum',
  'gallery',
  'music_venue',
  'mural',
  'historic_place',
  'theater',
  'other'
);

-- Update the category column to use the enum
ALTER TABLE locations
ALTER COLUMN category TYPE location_category USING category::location_category;

-- Add some sample data
INSERT INTO locations (title, description, category, latitude, longitude, address, website, phone)
VALUES 
  (
    'Nelson-Atkins Museum of Art',
    'World-renowned art museum featuring an extensive collection of art from around the world.',
    'museum',
    39.0457,
    -94.5804,
    '4525 Oak St, Kansas City, MO 64111',
    'https://nelson-atkins.org',
    '(816) 751-1278'
  ),
  (
    'Kemper Museum of Contemporary Art',
    'Modern and contemporary art museum with rotating exhibitions.',
    'museum',
    39.0457,
    -94.5804,
    '4420 Warwick Blvd, Kansas City, MO 64111',
    'https://www.kemperart.org',
    '(816) 753-5784'
  ); 