import { NextResponse } from "next/server";
import { updateUserInfo } from "@/app/serverfuns"; // adjust path to your actions file

export async function PUT(req: Request) {
  try {
    // Parse FormData from the request
    const formData = await req.formData();

    // Call your existing updateUserInfo function
    await updateUserInfo(formData);

    return NextResponse.json({ status: "success" });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { status: "error", message: err.message },
      { status: 500 }
    );
  }
}
