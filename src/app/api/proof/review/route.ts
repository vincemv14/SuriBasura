import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { checkAndAwardBadges } from "@/lib/badges";

// GET: fetch pending proofs for review (eco_officer or admin)
export async function GET() {
  const session = await getSession();
  if (!session || !["eco_officer", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const sql = getDb();
    const proofs = await sql`
      SELECT p.id, p.user_id, p.r_category, p.before_photo_url, p.after_photo_url,
             p.caption, p.status, p.created_at,
             u.name as user_name, u.barangay_school
      FROM proof_submissions p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'pending'
      ORDER BY p.created_at ASC
      LIMIT 50
    `;
    return NextResponse.json({ proofs });
  } catch (error) {
    console.error("Review fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch review queue" },
      { status: 500 }
    );
  }
}

// POST: approve/reject/flag a proof submission
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || !["eco_officer", "admin"].includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { proofId, action } = await request.json();

    if (!proofId || !["approved", "rejected", "flagged"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid proof ID or action." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Update proof status
    const result = await sql`
      UPDATE proof_submissions
      SET status = ${action},
          reviewed_by = ${session.userId},
          reviewed_at = NOW()
      WHERE id = ${proofId} AND status = 'pending'
      RETURNING id, user_id, r_category, season_id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Proof not found or already reviewed." },
        { status: 404 }
      );
    }

    // If approved, check and award badges
    if (action === "approved") {
      const proof = result[0];
      const seasonId = proof.season_id as number;
      if (seasonId) {
        await checkAndAwardBadges(proof.user_id as number, seasonId);
      }
    }

    return NextResponse.json({ success: true, status: action });
  } catch (error) {
    console.error("Review action error:", error);
    return NextResponse.json(
      { error: "Failed to process review." },
      { status: 500 }
    );
  }
}
