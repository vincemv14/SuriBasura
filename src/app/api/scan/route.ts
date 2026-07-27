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
    const { image, detectedItem, recommendedR } = await request.json();

    if (!detectedItem || !recommendedR) {
      return NextResponse.json(
        { error: "Missing classification data." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Get active season
    const seasons = await sql`
      SELECT id FROM seasons WHERE is_active = TRUE LIMIT 1
    `;
    const seasonId = seasons.length > 0 ? seasons[0].id : null;

    // Upload image to Cloudinary if provided
    let imageUrl: string | null = null;
    if (image) {
      try {
        imageUrl = await uploadImage(image, "suri-basura/scans");
      } catch (err) {
        console.error("Image upload failed:", err);
        // Continue without image — scan still valid
      }
    }

    const result = await sql`
      INSERT INTO scans (user_id, image_url, detected_item, recommended_r, season_id)
      VALUES (${session.userId}, ${imageUrl}, ${detectedItem}, ${recommendedR}, ${seasonId})
      RETURNING id, detected_item, recommended_r, created_at
    `;

    return NextResponse.json({ success: true, scan: result[0] });
  } catch (error) {
    console.error("Scan save error:", error);
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
    const scans = await sql`
      SELECT id, image_url, detected_item, recommended_r, created_at
      FROM scans
      WHERE user_id = ${session.userId}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json({ scans });
  } catch (error) {
    console.error("Scan fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch scans" }, { status: 500 });
  }
}
