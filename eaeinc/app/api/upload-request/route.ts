// app/api/upload-request/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createUploadRequest } from "@/app/serverfuns";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  // Ensure folder exists
  const pdfsDir = path.join(process.cwd(), "public/uploads/pdfs");
  await fs.mkdir(pdfsDir, { recursive: true });

  // Save file
  const uniqueName = `${Date.now()}-${file.name}`;
  const filePath = path.join(pdfsDir, uniqueName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const fileURL = `/uploads/pdfs/${uniqueName}`;

  // Save metadata in DB
  await createUploadRequest(
    formData.get("firstName") as string,
    formData.get("lastName") as string,
    formData.get("email") as string,
    formData.get("description") as string,
    JSON.parse(formData.get("keywords") as string),
    file.name,
    fileURL
  );

  return NextResponse.json({ success: true, fileURL });
}
