import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

// GET: fetch reward inventory and pending redemptions
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const sql = getDb();

    const inventory = await sql`
      SELECT id, item_name, item_name_fil, quantity_available, updated_at
      FROM reward_inventory
      ORDER BY id
    `;

    // Pending redemptions (unclaimed badges)
    const pendingRedemptions = await sql`
      SELECT ub.id, ub.user_id, ub.badge_id, ub.earned_at, ub.redemption_status,
             u.name as user_name, u.barangay_school,
             b.name as badge_name, b.tier
      FROM user_badges ub
      JOIN users u ON ub.user_id = u.id
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.redemption_status = 'unclaimed'
      ORDER BY ub.earned_at ASC
    `;

    return NextResponse.json({ inventory, pendingRedemptions });
  } catch (error) {
    console.error("Admin rewards error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rewards data" },
      { status: 500 }
    );
  }
}

// POST: claim a reward (admin marks badge as claimed)
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userBadgeId } = await request.json();

    if (!userBadgeId) {
      return NextResponse.json(
        { error: "Missing userBadgeId." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Mark as claimed
    const result = await sql`
      UPDATE user_badges
      SET redemption_status = 'claimed',
          claimed_at = NOW(),
          claimed_by_admin = ${session.userId}
      WHERE id = ${userBadgeId} AND redemption_status = 'unclaimed'
      RETURNING id, badge_id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Badge not found or already claimed." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim reward error:", error);
    return NextResponse.json(
      { error: "Failed to claim reward." },
      { status: 500 }
    );
  }
}

// PATCH: update inventory stock
export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { itemId, quantity } = await request.json();

    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing itemId or quantity." },
        { status: 400 }
      );
    }

    const sql = getDb();

    await sql`
      UPDATE reward_inventory
      SET quantity_available = ${quantity}, updated_at = NOW()
      WHERE id = ${itemId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update inventory error:", error);
    return NextResponse.json(
      { error: "Failed to update inventory." },
      { status: 500 }
    );
  }
}
