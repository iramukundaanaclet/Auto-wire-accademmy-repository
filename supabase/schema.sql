-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  youtube_video_id TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured);
CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_youtube_video_id ON videos(youtube_video_id);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
  ('Electric Vehicles', 'EV systems and technology'),
  ('Engine Systems', 'Internal combustion engines'),
  ('Brake Systems', 'Braking systems and components'),
  ('Electrical Systems', 'Vehicle electrical wiring'),
  ('Vehicle Diagnostics', 'Diagnostic procedures'),
  ('Suspension Systems', 'Suspension and steering'),
  ('Transmission', 'Transmission systems'),
  ('Automotive Technology', 'General automotive tech'),
  ('Vehicle Maintenance', 'Maintenance procedures'),
  ('Body Repair', 'Body work and repair')
ON CONFLICT DO NOTHING;

-- Insert the initial EV Electrical Systems video
INSERT INTO videos (title, description, youtube_url, youtube_video_id, thumbnail_url, category_id, status, featured, display_order)
SELECT 
  'EV Electrical Systems BASICS',
  'An introductory video about EV electrical systems and their basic components.',
  'https://youtu.be/mNOYS-duUJY',
  'mNOYS-duUJY',
  'https://img.youtube.com/vi/mNOYS-duUJY/hqdefault.jpg',
  (SELECT id FROM categories WHERE name = 'Electric Vehicles' LIMIT 1),
  'published',
  true,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM videos WHERE youtube_video_id = 'mNOYS-duUJY'
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Categories
-- Public can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can modify categories (optional - adjust based on auth setup)
CREATE POLICY "Only authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for Videos
-- Public can read published videos
CREATE POLICY "Published videos are viewable by everyone"
  ON videos FOR SELECT
  TO public
  USING (status = 'published');

-- Authenticated users can read all videos (for admin)
CREATE POLICY "All videos are viewable by authenticated users"
  ON videos FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can insert videos
CREATE POLICY "Only authenticated users can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update videos
CREATE POLICY "Only authenticated users can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete videos
CREATE POLICY "Only authenticated users can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
