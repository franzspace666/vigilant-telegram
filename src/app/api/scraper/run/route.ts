import { NextResponse } from "next/server";
import { runAllScrapers } from "@/lib/scrapers";

export async function POST() {
  try {
    await runAllScrapers();
    return NextResponse.json({ success: true, message: "Scraper run completed" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
