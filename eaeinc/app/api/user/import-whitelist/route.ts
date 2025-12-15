import { NextResponse } from "next/server";
import { importWhitelistUsers } from "@/app/whitelistLoader";

export async function POST() {
  try {
    const summary = await importWhitelistUsers();
    return NextResponse.json({ status: "ok", ...summary });
  } catch (err: any) {
    console.error("Error importing whitelist:", err);
    return NextResponse.json(
      {
        status: "error",
        message: err?.message || "Unable to import whitelist users",
      },
      { status: 500 }
    );
  }
}