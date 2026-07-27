import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const sql = getDb();
    const seasons = await sql`
      SELECT id, name, start_date, end_date, is_active, created_at
      FROM seasons
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ seasons });
  } catch (error) {
    console.error("Seasons fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch seasons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name, startDate } = await request.json();

    if (!name || !startDate) {
      return NextResponse.json(
        { error: "Name and start date required." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Deactivate all current seasons
    await sql`UPDATE seasons SET is_active = FALSE`;

    // Create new active season
    const result = await sql`
      INSERT INTO seasons (name, start_date, is_active)
      VALUES (${name}, ${startDate}, TRUE)
      RETURNING id, name, start_date, is_active
    `;

    return NextResponse.json({ success: true, season: result[0] });
  } catch (error) {
    console.error("Create season error:", error);
    return NextResponse.json({ error: "Failed to create season" }, { status: 500 });
  }
}
