import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { db } from "@/app/database";

export async function GET() {
  try {
    const csvPath = path.resolve(process.cwd(), "..", "Database", "searchTags.csv");
    const csvContents = await fs.readFile(csvPath, "utf8");

    const csvTags = csvContents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(
        (line) =>
          line.length > 0 &&
          !line.toLowerCase().startsWith("keywords for tagging") &&
          !line.startsWith("#")
      );

    const uniqueTags = Array.from(new Set(csvTags));

    let dbTags: string[] | null = null;

    try {
      if (uniqueTags.length > 0) {
        await Promise.all(
          uniqueTags.map((tag) =>
            db.execute(`INSERT IGNORE INTO Tag (tagName) VALUES (?)`, [tag])
          )
        );
      }

      const [rows] = await db.execute(`SELECT tagName FROM Tag ORDER BY tagName ASC`);
      dbTags = (rows as any[]).map((row) => row.tagName as string);
    } catch (dbError) {
      console.error("Failed to sync or read tags from the database: ", dbError);
    }

    return NextResponse.json({ tags: dbTags ?? uniqueTags });
  } catch (error) {
    console.error("Failed to load tags from CSV:", error);
    return NextResponse.json({ tags: [] });
  }
}