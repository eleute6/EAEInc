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
    // Check if user exists
    const [rows] = await db.execute(
      "SELECT userName, emailID, pictureURL, department, bio FROM UserInfo WHERE emailID = ?",
      [email]
    );

    if ((rows as any[]).length === 0) {
      // If not found, insert a new user with defaults
      await db.execute(
        "INSERT INTO UserInfo (userName, emailID, pictureURL, bio, department, currentContributionScore, highestContributionScore, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        ["New User", email, "", "Not Specified", "Not Specified", 0, 0, false]
      );

      return NextResponse.json({
        status: "created",
        name: "New User",
        email,
        image: "",
      });
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
