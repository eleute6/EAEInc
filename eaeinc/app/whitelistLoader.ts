import { db } from "@/app/database";
import fs from "fs/promises";
import path from "path";
import type { ResultSetHeader } from "mysql2";

interface WhitelistEntry {
  name: string;
  email: string;
}

function unquote(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function parseWhitelistCsv(csv: string): WhitelistEntry[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const [, ...rows] = lines;

  return rows
    .map((line) => {
      const [rawName, rawEmail] = line.split(",");
      const name = unquote(rawName);
      const email = unquote(rawEmail);
      return { name, email };
    })
    .filter((entry) => entry.name.length > 0 && entry.email.length > 0);
}

export async function importWhitelistUsers(customPath?: string) {
  const csvPath = customPath
    ? path.resolve(customPath)
    : path.resolve(process.cwd(), "..", "Database", "whitelist.csv");

  const csvContent = await fs.readFile(csvPath, "utf8");
  const entries = parseWhitelistCsv(csvContent);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO UserInfo (emailID, userName)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE userName = VALUES(userName)`,
      [entry.email, entry.name]
    );

    const affected = result.affectedRows ?? 0;
    if (affected === 1) {
      inserted += 1;
    } else if (affected === 2) {
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  return {
    total: entries.length,
    inserted,
    updated,
    skipped,
    source: csvPath,
  };
}