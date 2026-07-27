import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sql = getDb();

    const totalScans = await sql`SELECT COUNT(*) as cnt FROM scans`;
    const totalApproved = await sql`SELECT COUNT(*) as cnt FROM proof_submissions WHERE status = 'approved'`;
    const totalBadges = await sql`SELECT COUNT(*) as cnt FROM user_badges`;

    const todayScans = await sql`
      SELECT COUNT(*) as cnt FROM scans
      WHERE created_at::date = CURRENT_DATE
    `;

    const categoryBreakdown = await sql`
      SELECT r_category, COUNT(*) as cnt
      FROM proof_submissions
      WHERE status = 'approved'
      GROUP BY r_category
      ORDER BY cnt DESC
    `;

    const topBarangay = await sql`
      SELECT u.barangay_school, COUNT(p.id) as cnt
      FROM users u
      JOIN proof_submissions p ON u.id = p.user_id AND p.status = 'approved'
      WHERE u.barangay_school IS NOT NULL AND u.barangay_school != ''
      GROUP BY u.barangay_school
      ORDER BY cnt DESC
      LIMIT 1
    `;

    return NextResponse.json({
      totalScans: Number(totalScans[0].cnt),
      totalApproved: Number(totalApproved[0].cnt),
      totalBadges: Number(totalBadges[0].cnt),
      todayScans: Number(todayScans[0].cnt),
      categoryBreakdown,
      topBarangay: topBarangay[0]?.barangay_school || null,
    });
  } catch (error) {
    console.error("Impact stats error:", error);
    // Return zeros if DB not configured yet
    return NextResponse.json({
      totalScans: 0,
      totalApproved: 0,
      totalBadges: 0,
      todayScans: 0,
      categoryBreakdown: [],
      topBarangay: null,
    });
  }
}
