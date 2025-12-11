import { NextResponse } from "next/server";
import { db } from "@/app/database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { status: "error", message: "Missing email" },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.execute(
      "SELECT userName, emailID, pictureURL, department, bio FROM UserInfo WHERE emailID = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      // User not found — just report that, don't insert placeholders here
      return NextResponse.json({ status: "not_found" }, { status: 404 });
    }

    const user = (rows as any[])[0];
    return NextResponse.json({
      status: "valid",
      name: user.userName,
      email: user.emailID,
      image: user.pictureURL,
      department: user.department,
      bio: user.bio,
    });
  } catch (err: any) {
    console.error("Error in /api/user:", err);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
