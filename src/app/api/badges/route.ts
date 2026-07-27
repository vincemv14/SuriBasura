import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Get active season
    const seasons = await sql`
      SELECT id FROM seasons WHERE is_active = TRUE LIMIT 1
    `;
    const seasonId = seasons.length > 0 ? (seasons[0].id as number) : null;

    // Get all badges
    const allBadges = await sql`
      SELECT id, name, name_fil, tier, r_required, reward_description, reward_description_fil
      FROM badges
      ORDER BY tier, r_required
    `;

    // Get user's earned badges
    const earnedBadges = await sql`
      SELECT ub.id, ub.badge_id, ub.earned_at, ub.redemption_status, ub.claimed_at,
             b.name, b.name_fil, b.tier, b.r_required
      FROM user_badges ub
      JOIN badges b ON ub.badge_id = b.id
      WHERE ub.user_id = ${session.userId}
        AND (ub.season_id = ${seasonId} OR ${seasonId} IS NULL)
      ORDER BY ub.earned_at DESC
    `;

    // Get user's approved proof stats for progress display
    const proofStats = await sql`
      SELECT r_category, COUNT(*) as cnt
      FROM proof_submissions
      WHERE user_id = ${session.userId}
        AND status = 'approved'
        AND (season_id = ${seasonId} OR ${seasonId} IS NULL)
      GROUP BY r_category
    `;

    return NextResponse.json({
      allBadges,
      earnedBadges,
      proofStats,
      distinctRCompleted: proofStats.length,
    });
  } catch (error) {
    console.error("Badges fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}
