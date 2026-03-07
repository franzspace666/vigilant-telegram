import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zdroj = searchParams.get("zdroj");
  const oblast = searchParams.get("oblast");
  const status = searchParams.get("status") || "otevrena";
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = {};

  if (zdroj) where.zdroj = zdroj;
  if (status && status !== "all") where.status = status;
  if (oblast) where.oblasti = { has: oblast };
  if (search) where.nazev = { contains: search, mode: "insensitive" };

  const [vyzvy, total] = await Promise.all([
    prisma.vyzva.findMany({
      where,
      orderBy: { deadline: "asc" },
      take: limit,
      skip: offset,
    }),
    prisma.vyzva.count({ where }),
  ]);

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vyzvy: vyzvy.map((v: any) => ({
      ...v,
      alokace: v.alokace?.toString() ?? null,
      minCastka: v.minCastka?.toString() ?? null,
      maxCastka: v.maxCastka?.toString() ?? null,
    })),
    total,
    limit,
    offset,
  });
}
