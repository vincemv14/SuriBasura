import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

/**
 * GET /api/setup
 * 
 * Run this ONCE to initialize the database schema and seed data.
 * Creates tables, seeds badges/inventory/seasons, and creates a default admin account.
 * 
 * After running, remove this route or protect it.
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  
  // Basic protection — require a query param to prevent accidental runs
  if (secret !== "setup-suri-basura") {
    return NextResponse.json(
      { error: "Add ?secret=setup-suri-basura to run setup" },
      { status: 403 }
    );
  }

  try {
    const sql = getDb();

    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        barangay_school VARCHAR(200),
        pin_hash VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'eco_officer', 'admin')),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS seasons (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS scans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_url TEXT,
        detected_item VARCHAR(100) NOT NULL,
        recommended_r VARCHAR(20) NOT NULL CHECK (recommended_r IN ('reduce', 'reuse', 'recover', 'recycle', 'repair')),
        season_id INTEGER REFERENCES seasons(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS badges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        name_fil VARCHAR(100),
        tier VARCHAR(20) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'category')),
        r_required VARCHAR(20) CHECK (r_required IN ('reduce', 'reuse', 'recover', 'recycle', 'repair')),
        reward_description TEXT,
        reward_description_fil TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
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
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reward_inventory (
        id SERIAL PRIMARY KEY,
        item_name VARCHAR(100) NOT NULL,
        item_name_fil VARCHAR(100),
        quantity_available INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Seed badges
    const existingBadges = await sql`SELECT COUNT(*) as cnt FROM badges`;
    if (Number(existingBadges[0].cnt) === 0) {
      await sql`
        INSERT INTO badges (name, name_fil, tier, r_required, reward_description, reward_description_fil) VALUES
          ('Bronze Badge', 'Bronze na Badge', 'bronze', NULL, 'First approved proof submission', 'Unang na-approve na proof'),
          ('Silver Badge', 'Silver na Badge', 'silver', NULL, '5 approved proofs across 3+ R categories', '5 approved proofs sa 3+ R categories'),
          ('Gold Badge - Full 5R', 'Gold na Badge - Buo ang 5R', 'gold', NULL, 'At least one approved proof in EACH of the 5 R categories', 'May approved proof sa bawat isa sa 5 R categories'),
          ('Reduce Medal', 'Medalya ng Reduce', 'category', 'reduce', 'First approved Reduce proof', 'Unang na-approve na Reduce proof'),
          ('Reuse Medal', 'Medalya ng Reuse', 'category', 'reuse', 'First approved Reuse proof', 'Unang na-approve na Reuse proof'),
          ('Recover Medal', 'Medalya ng Recover', 'category', 'recover', 'First approved Recover proof', 'Unang na-approve na Recover proof'),
          ('Recycle Medal', 'Medalya ng Recycle', 'category', 'recycle', 'First approved Recycle proof', 'Unang na-approve na Recycle proof'),
          ('Repair Medal', 'Medalya ng Repair', 'category', 'repair', 'First approved Repair proof', 'Unang na-approve na Repair proof')
      `;
    }

    // Seed inventory
    const existingInventory = await sql`SELECT COUNT(*) as cnt FROM reward_inventory`;
    if (Number(existingInventory[0].cnt) === 0) {
      await sql`
        INSERT INTO reward_inventory (item_name, item_name_fil, quantity_available) VALUES
          ('Ballpen', 'Ballpen', 100),
          ('Notebook', 'Notebook', 50),
          ('Pencil Case', 'Pencil Case', 30),
          ('Art/Ruler Set', 'Art/Ruler Set', 20),
          ('Complete School Kit Bundle', 'Kumpletong School Kit', 10)
      `;
    }

    // Seed season
    const existingSeasons = await sql`SELECT COUNT(*) as cnt FROM seasons`;
    if (Number(existingSeasons[0].cnt) === 0) {
      await sql`
        INSERT INTO seasons (name, start_date, is_active) VALUES
          ('Season 1 - 2026', '2026-01-01', TRUE)
      `;
    }

    // Create default admin account
    const existingAdmin = await sql`SELECT COUNT(*) as cnt FROM users WHERE role = 'admin'`;
    if (Number(existingAdmin[0].cnt) === 0) {
      const adminPasswordHash = await hashPassword("admin123");
      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Admin', 'admin@suribasura.ph', ${adminPasswordHash}, 'admin')
      `;
    }

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_scans_user_id ON scans(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scans_season_id ON scans(season_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_proof_user_id ON proof_submissions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_proof_status ON proof_submissions(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_proof_season_id ON proof_submissions(season_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_user_badges_season_id ON user_badges(season_id)`;

    return NextResponse.json({
      success: true,
      message: "Database setup complete! Default admin: admin@suribasura.ph / admin123",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: `Setup failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
