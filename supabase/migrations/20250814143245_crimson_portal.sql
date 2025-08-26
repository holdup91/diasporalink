/*
  # DiasporaLink Database Schema

  1. New Tables
    - `carriers` - Traveler profiles with contact info and ratings
    - `countries` - Country reference data with translations
    - `cities` - City reference data with coordinates and translations
    - `trips` - Main trip data with origin/destination
    - `trip_stops` - Pickup/dropoff stops for trips
    - `trip_contacts` - Contact methods per trip (enum: phone, whatsapp, messenger)
    - `trip_analytics` - User interaction tracking
    - `search_logs` - Search analytics

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on trips, cities, countries
    - Add policies for authenticated users to manage their own data

  3. Enums
    - contact_type_enum for standardized contact methods
    - trip_status_enum for trip statuses
    - stop_type_enum for pickup/dropoff types
*/

-- Create enums
CREATE TYPE contact_type_enum AS ENUM ('phone', 'whatsapp', 'messenger');
CREATE TYPE trip_status_enum AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE stop_type_enum AS ENUM ('pickup', 'dropoff', 'both');

-- Create carriers table
CREATE TABLE IF NOT EXISTS carriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  whatsapp text,
  messenger text,
  rating decimal(3,2) DEFAULT 5.00,
  total_trips integer DEFAULT 0,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  flag_emoji text NOT NULL
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id serial PRIMARY KEY,
  country_id integer NOT NULL REFERENCES countries(id),
  name_en text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  latitude decimal(10,8),
  longitude decimal(11,8),
  aliases text[],
  created_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id text UNIQUE NOT NULL,
  traveler_id uuid NOT NULL REFERENCES carriers(id),
  origin_city_id integer REFERENCES cities(id),
  origin_country_id integer REFERENCES countries(id),
  destination_city_id integer REFERENCES cities(id),
  destination_country_id integer REFERENCES countries(id),
  departure_date date NOT NULL,
  price_per_kg decimal(8,2) NOT NULL,
  currency text NOT NULL,
  available_kg integer NOT NULL,
  notes text,
  origin_flag text,
  destination_flag text,
  status trip_status_enum DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure either city or country is specified for origin and destination
  CONSTRAINT origin_location_check CHECK (
    (origin_city_id IS NOT NULL) OR (origin_country_id IS NOT NULL)
  ),
  CONSTRAINT destination_location_check CHECK (
    (destination_city_id IS NOT NULL) OR (destination_country_id IS NOT NULL)
  )
);

-- Create trip_stops table
CREATE TABLE IF NOT EXISTS trip_stops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  city_id integer REFERENCES cities(id),
  country_id integer REFERENCES countries(id),
  stop_order integer NOT NULL,
  stop_type stop_type_enum NOT NULL,
  address text,
  availability_time text,
  instructions text,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure either city or country is specified
  CONSTRAINT stop_location_check CHECK (
    (city_id IS NOT NULL) OR (country_id IS NOT NULL)
  )
);

-- Create trip_contacts table
CREATE TABLE IF NOT EXISTS trip_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  contact_type contact_type_enum NOT NULL,
  contact_value text NOT NULL,
  contact_label text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create trip_analytics table
CREATE TABLE IF NOT EXISTS trip_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  visit_date timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  device_type text,
  country text,
  city text,
  referrer text,
  clicked_phone boolean DEFAULT false,
  clicked_whatsapp boolean DEFAULT false,
  clicked_messenger boolean DEFAULT false,
  other_interactions jsonb
);

-- Create search_logs table
CREATE TABLE IF NOT EXISTS search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES carriers(id),
  origin_query text,
  destination_query text,
  results_count integer,
  ip_address text,
  user_agent text,
  device_type text,
  country text,
  city text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_departure_date ON trips(departure_date);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_origin_city ON trips(origin_city_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination_city ON trips(destination_city_id);
CREATE INDEX IF NOT EXISTS idx_trips_origin_country ON trips(origin_country_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination_country ON trips(destination_country_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city ON trip_stops(city_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_country ON trip_stops(country_id);
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_carriers_username ON carriers(username);

-- Enable Row Level Security
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Public read access for reference data
CREATE POLICY "Countries are publicly readable"
  ON countries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Cities are publicly readable"
  ON cities FOR SELECT
  TO public
  USING (true);

-- Public read access for active trips and related data
CREATE POLICY "Active trips are publicly readable"
  ON trips FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Trip stops are publicly readable for active trips"
  ON trip_stops FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.status = 'active'
    )
  );

CREATE POLICY "Trip contacts are publicly readable for active trips"
  ON trip_contacts FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_contacts.trip_id 
      AND trips.status = 'active'
    )
  );

-- Carriers can read their own data and public profile info
CREATE POLICY "Carriers can read their own data"
  ON carriers FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public carrier profiles are readable"
  ON carriers FOR SELECT
  TO public
  USING (true);

-- Carriers can manage their own trips
CREATE POLICY "Carriers can manage their own trips"
  ON trips FOR ALL
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Carriers can manage their own trip stops"
  ON trip_stops FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_stops.trip_id 
      AND trips.traveler_id = auth.uid()
    )
  );

CREATE POLICY "Carriers can manage their own trip contacts"
  ON trip_contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = trip_contacts.trip_id 
      AND trips.traveler_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Trip analytics are publicly insertable"
  ON trip_analytics FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Search logs are publicly insertable"
  ON search_logs FOR INSERT
  TO public
  WITH CHECK (true);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_carriers_updated_at BEFORE UPDATE ON carriers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
