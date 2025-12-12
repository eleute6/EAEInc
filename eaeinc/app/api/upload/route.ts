import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// POST /api/upload
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save file to /public/uploads
    await fs.writeFile(path.join(uploadDir, filename), buffer);

    // Return the filename so you can store it in DB
    return NextResponse.json({ filename });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
