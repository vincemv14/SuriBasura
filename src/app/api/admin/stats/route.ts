import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || !["admin", "eco_officer"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const sql = getDb();

    const totalUsers = await sql`SELECT COUNT(*) as cnt FROM users WHERE role = 'user'`;
    const totalScans = await sql`SELECT COUNT(*) as cnt FROM scans`;
    const totalApproved = await sql`SELECT COUNT(*) as cnt FROM proof_submissions WHERE status = 'approved'`;
    const totalBadges = await sql`SELECT COUNT(*) as cnt FROM user_badges`;

    // Leaderboard by user
    const leaderboard = await sql`
      SELECT u.id, u.name, u.barangay_school,
             COUNT(DISTINCT p.r_category) as distinct_r,
             COUNT(p.id) as total_proofs
      FROM users u
      LEFT JOIN proof_submissions p ON u.id = p.user_id AND p.status = 'approved'
      WHERE u.role = 'user'
      GROUP BY u.id, u.name, u.barangay_school
      ORDER BY distinct_r DESC, total_proofs DESC
      LIMIT 20
    `;

    // Stats by barangay
    const barangayStats = await sql`
      SELECT u.barangay_school,
             COUNT(DISTINCT p.id) as total_proofs,
             COUNT(DISTINCT u.id) as total_users
      FROM users u
      LEFT JOIN proof_submissions p ON u.id = p.user_id AND p.status = 'approved'
      WHERE u.barangay_school IS NOT NULL AND u.barangay_school != ''
      GROUP BY u.barangay_school
      ORDER BY total_proofs DESC
      LIMIT 10
    `;

    // Category breakdown
    const categoryBreakdown = await sql`
      SELECT r_category, COUNT(*) as cnt
      FROM proof_submissions
      WHERE status = 'approved'
      GROUP BY r_category
    `;

    return NextResponse.json({
      totalUsers: totalUsers[0].cnt,
      totalScans: totalScans[0].cnt,
      totalApproved: totalApproved[0].cnt,
      totalBadges: totalBadges[0].cnt,
      leaderboard,
      barangayStats,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
