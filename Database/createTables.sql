-- Kullanıcılar tablosu
CREATE TABLE GP_USERS (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor')),
  phone VARCHAR(20),
  address TEXT,
  other TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  reset_token TEXT,
  reset_token_expiry TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Lokasyonlar tablosu
CREATE TABLE GP_LOCATIONS (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  city VARCHAR(50),
  country VARCHAR(50) DEFAULT 'Germany',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Ofisler tablosu
CREATE TABLE GP_OFFICES (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location_id UUID REFERENCES GP_LOCATIONS(id),
  capacity INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserviert')),
  equipment TEXT[],
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Rezervasyonlar tablosu
CREATE TABLE IF NOT EXISTS gp_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES gp_users(id),
  office_id UUID REFERENCES gp_offices(id),
  reservation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Test verileri ekle
INSERT INTO GP_LOCATIONS (name, city, address) VALUES 
('Köln Ofisleri', 'Köln', 'Kaiser-Wilhelm-Ring 50, 50672 Köln'),
('Berlin Ofisleri', 'Berlin', 'Hauptstraße 123, 10115 Berlin'),
('Belçika Ofisleri', 'Brüksel', 'Rue Neuve 45, 1000 Brussels');

INSERT INTO GP_OFFICES (name, location_id, description, status) VALUES 
('Ofis 1', (SELECT id FROM GP_LOCATIONS WHERE name = 'Köln Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 2', (SELECT id FROM GP_LOCATIONS WHERE name = 'Köln Ofisleri'), 'Büro, modern tasarımlı', 'reserviert'),
('Ofis 3', (SELECT id FROM GP_LOCATIONS WHERE name = 'Köln Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 4', (SELECT id FROM GP_LOCATIONS WHERE name = 'Köln Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 5', (SELECT id FROM GP_LOCATIONS WHERE name = 'Köln Ofisleri'), 'Toplantı odası, modern tasarımlı', 'available'),
('Ofis 1', (SELECT id FROM GP_LOCATIONS WHERE name = 'Berlin Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 2', (SELECT id FROM GP_LOCATIONS WHERE name = 'Berlin Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 3', (SELECT id FROM GP_LOCATIONS WHERE name = 'Berlin Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 4', (SELECT id FROM GP_LOCATIONS WHERE name = 'Berlin Ofisleri'), 'Büro, modern tasarımlı', 'available'),
('Ofis 5', (SELECT id FROM GP_LOCATIONS WHERE name = 'Berlin Ofisleri'), 'Toplantı odası, modern tasarımlı', 'available'),
('Ofis 1', (SELECT id FROM GP_LOCATIONS WHERE name = 'Belçika Ofisleri'), 'Toplantı odası', 'available');

-- Admin kullanıcı ekle (şifre: admin123)
INSERT INTO GP_USERS (email, password, name, role, other) VALUES 
('admin@gesundprime.com', '$2a$10$D696.Gbbp6qt07xOc2ygTOiPbjVk2BO8ZFa.emYzvz.4mkJtnWQr2', 'Sistem Admin', 'admin', 'Yönetici');

-- Doktor kullanıcılar ekle (şifre: doctor123)
INSERT INTO GP_USERS (email, password, name, role, other) VALUES 
('test@gesundprime.com', '$2a$10$Y8QlDMo05vt9otoUA.dZGuQNNEJI14cGwz8VvjOjIO.Rta0q/bboK', 'Dr. Ayşe Yılmaz', 'doctor', 'Test');
