-- ===========================================
-- SuriBasura Database Schema
-- Run this against your Neon database
-- ===========================================

-- Users table: supports PIN-based auth for kids and email/password for admins
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  barangay_school VARCHAR(200),
  pin_hash VARCHAR(255),         -- for user/eco_officer PIN login
  email VARCHAR(255) UNIQUE,     -- for admin email login
  password_hash VARCHAR(255),    -- for admin password login
  role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'eco_officer', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seasons/cycles for periodic resets
CREATE TABLE IF NOT EXISTS seasons (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,          -- e.g. "1st Semester 2026"
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scans table: AI classification results
CREATE TABLE IF NOT EXISTS scans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT,
  detected_item VARCHAR(100) NOT NULL,
  recommended_r VARCHAR(20) NOT NULL CHECK (recommended_r IN ('reduce', 'reuse', 'recover', 'recycle', 'repair')),
  season_id INTEGER REFERENCES seasons(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Proof submissions: user-submitted evidence of 5R actions
CREATE TABLE IF NOT EXISTS proof_submissions (
  id SERIAL PRIMARY KEY,
  scan_id INTEGER REFERENCES scans(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  r_category VARCHAR(20) NOT NULL CHECK (r_category IN ('reduce', 'reuse', 'recover', 'recycle', 'repair')),
  before_photo_url TEXT,
  after_photo_url TEXT,
  caption TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged', 'rejected')),
  reviewed_by INTEGER REFERENCES users(id),
  reviewed_at TIMESTAMP,
  season_id INTEGER REFERENCES seasons(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Badges: medal/badge definitions
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_fil VARCHAR(100),            -- Filipino name
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'category')),
  r_required VARCHAR(20) CHECK (r_required IN ('reduce', 'reuse', 'recover', 'recycle', 'repair')),  -- for category-specific medals
  reward_description TEXT,
  reward_description_fil TEXT,      -- Filipino description
  created_at TIMESTAMP DEFAULT NOW()
);

-- User badges: earned by users
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  season_id INTEGER REFERENCES seasons(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  redemption_status VARCHAR(20) NOT NULL DEFAULT 'unclaimed' CHECK (redemption_status IN ('unclaimed', 'claimed')),
  claimed_at TIMESTAMP,
  claimed_by_admin INTEGER REFERENCES users(id),
  UNIQUE(user_id, badge_id, season_id)
);

-- Reward inventory: admin-managed stock
CREATE TABLE IF NOT EXISTS reward_inventory (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(100) NOT NULL,
  item_name_fil VARCHAR(100),       -- Filipino name
  quantity_available INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seed initial badges
INSERT INTO badges (name, name_fil, tier, r_required, reward_description, reward_description_fil) VALUES
  ('Bronze Badge', 'Bronze na Badge', 'bronze', NULL, 'First approved proof submission', 'Unang na-approve na proof'),
  ('Silver Badge', 'Silver na Badge', 'silver', NULL, '5 approved proofs across 3+ R categories', '5 approved proofs sa 3+ R categories'),
  ('Gold Badge - Full 5R', 'Gold na Badge - Buo ang 5R', 'gold', NULL, 'At least one approved proof in EACH of the 5 R categories', 'May approved proof sa bawat isa sa 5 R categories'),
  ('Reduce Medal', 'Medalya ng Reduce', 'category', 'reduce', 'First approved Reduce proof', 'Unang na-approve na Reduce proof'),
  ('Reuse Medal', 'Medalya ng Reuse', 'category', 'reuse', 'First approved Reuse proof', 'Unang na-approve na Reuse proof'),
  ('Recover Medal', 'Medalya ng Recover', 'category', 'recover', 'First approved Recover proof', 'Unang na-approve na Recover proof'),
  ('Recycle Medal', 'Medalya ng Recycle', 'category', 'recycle', 'First approved Recycle proof', 'Unang na-approve na Recycle proof'),
  ('Repair Medal', 'Medalya ng Repair', 'category', 'repair', 'First approved Repair proof', 'Unang na-approve na Repair proof')
ON CONFLICT DO NOTHING;

-- Seed initial reward inventory
INSERT INTO reward_inventory (item_name, item_name_fil, quantity_available) VALUES
  ('Ballpen', 'Ballpen', 100),
  ('Notebook', 'Notebook', 50),
  ('Pencil Case', 'Pencil Case', 30),
  ('Art/Ruler Set', 'Art/Ruler Set', 20),
  ('Complete School Kit Bundle', 'Kumpletong School Kit', 10)
ON CONFLICT DO NOTHING;

-- Seed default active season
INSERT INTO seasons (name, start_date, is_active) VALUES
  ('Season 1 - 2026', '2026-01-01', TRUE)
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scans_season_id ON scans(season_id);
CREATE INDEX IF NOT EXISTS idx_proof_user_id ON proof_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_proof_status ON proof_submissions(status);
CREATE INDEX IF NOT EXISTS idx_proof_season_id ON proof_submissions(season_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_season_id ON user_badges(season_id);
