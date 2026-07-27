import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPin, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, barangaySchool, pin } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Kailangan ang pangalan mo." },
        { status: 400 }
      );
    }

    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        { error: "Ang PIN ay dapat 4 na numero." },
        { status: 400 }
      );
    }

    const sql = getDb();

    // Check if name + barangay combo already exists
    const existing = await sql`
      SELECT id FROM users
      WHERE LOWER(name) = LOWER(${name.trim()})
        AND LOWER(COALESCE(barangay_school, '')) = LOWER(${(barangaySchool || "").trim()})
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "May gumagamit na ng pangalan na ito sa barangay/school mo." },
        { status: 409 }
      );
    }

    const pinHash = await hashPin(pin);

    const result = await sql`
      INSERT INTO users (name, barangay_school, pin_hash, role)
      VALUES (${name.trim()}, ${(barangaySchool || "").trim()}, ${pinHash}, 'user')
      RETURNING id, name, barangay_school, role
    `;

    const user = result[0];
    const token = await createSession({
      userId: user.id as number,
      name: user.name as string,
      role: user.role as "user",
      barangaySchool: user.barangay_school as string,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "May nangyaring mali. Subukan ulit!" },
      { status: 500 }
    );
  }
}
