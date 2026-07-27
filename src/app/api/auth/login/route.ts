import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPin, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, barangaySchool, pin } = await request.json();

    if (!name || !pin) {
      return NextResponse.json(
        { error: "Kailangan ang pangalan at PIN." },
        { status: 400 }
      );
    }

    const sql = getDb();

    const users = await sql`
      SELECT id, name, barangay_school, pin_hash, role
      FROM users
      WHERE LOWER(name) = LOWER(${name.trim()})
        AND LOWER(COALESCE(barangay_school, '')) = LOWER(${(barangaySchool || "").trim()})
        AND pin_hash IS NOT NULL
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Hindi ka pa naka-register. Mag-register ka muna!" },
        { status: 404 }
      );
    }

    const user = users[0];
    const isValid = await verifyPin(pin, user.pin_hash as string);

    if (!isValid) {
      return NextResponse.json(
        { error: "Mali ang PIN mo. Subukan ulit!" },
        { status: 401 }
      );
    }

    const token = await createSession({
      userId: user.id as number,
      name: user.name as string,
      role: user.role as "user" | "eco_officer" | "admin",
      barangaySchool: user.barangay_school as string,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "May nangyaring mali. Subukan ulit!" },
      { status: 500 }
    );
  }
}
