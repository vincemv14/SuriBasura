import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { scanId, rCategory, beforePhoto, afterPhoto, caption } =
      await request.json();

    if (!rCategory) {
      return NextResponse.json(
        { error: "Kailangan pumili ng R category." },
        { status: 400 }
      );
    }

    if (!beforePhoto || !afterPhoto) {
      return NextResponse.json(
        { error: "Kailangan ng before at after photo." },
        { status: 400 }
      );
    }

    if (!caption || !caption.trim()) {
      return NextResponse.json(
        { error: "Maglagay ng maikling caption." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Get active season
    const seasons = await sql`
      SELECT id FROM seasons WHERE is_active = TRUE LIMIT 1
    `;
    const seasonId = seasons.length > 0 ? seasons[0].id : null;

    // Upload photos to Cloudinary
    let beforeUrl: string;
    let afterUrl: string;

    try {
      beforeUrl = await uploadImage(beforePhoto, "suri-basura/proofs/before");
      afterUrl = await uploadImage(afterPhoto, "suri-basura/proofs/after");
    } catch (err) {
      console.error("Photo upload failed:", err);
      return NextResponse.json(
        { error: "Hindi ma-upload ang photos. Subukan ulit!" },
        { status: 500 }
      );
    }

    const result = await sql`
      INSERT INTO proof_submissions (scan_id, user_id, r_category, before_photo_url, after_photo_url, caption, status, season_id)
      VALUES (${scanId || null}, ${session.userId}, ${rCategory}, ${beforeUrl}, ${afterUrl}, ${caption.trim()}, 'pending', ${seasonId})
      RETURNING id, r_category, status, created_at
    `;

    return NextResponse.json({ success: true, proof: result[0] });
  } catch (error) {
    console.error("Proof submission error:", error);
    return NextResponse.json(
      { error: "May nangyaring mali. Subukan ulit!" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const proofs = await sql`
      SELECT id, scan_id, r_category, before_photo_url, after_photo_url, caption, status, created_at
      FROM proof_submissions
      WHERE user_id = ${session.userId}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json({ proofs });
  } catch (error) {
    console.error("Proof fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch proofs" },
      { status: 500 }
    );
  }
}
