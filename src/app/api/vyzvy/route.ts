import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeRelevance } from "@/lib/relevance";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zdroj = searchParams.get("zdroj");
  const oblast = searchParams.get("oblast");
  const status = searchParams.get("status") || "otevrena";
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");
  const typ = searchParams.get("typ") || "vyzva";

  const now = new Date();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  if (zdroj) where.zdroj = zdroj;
  if (status && status !== "all") where.status = status;
  if (oblast) where.oblasti = { has: oblast };
  if (search) where.nazev = { contains: search, mode: "insensitive" };
  if (typ !== "all") where.typZaznamu = typ;

  // Skrýt výzvy s prošlým deadlinem (výzvy bez deadline zobrazujeme – průběžné programy)
  where.OR = [{ deadline: null }, { deadline: { gte: now } }];

  // Skrýt výzvy bez jakýchkoliv podrobností
  where.AND = [
    { OR: [{ popis: { not: null } }, { plnyText: { not: null } }] },
  ];

  const [vyzvy, total] = await Promise.all([
    prisma.vyzva.findMany({
      where,
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.vyzva.count({ where }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serialized = vyzvy.map((v: any) => ({
    ...v,
    alokace: v.alokace?.toString() ?? null,
    minCastka: v.minCastka?.toString() ?? null,
    maxCastka: v.maxCastka?.toString() ?? null,
    relevance: computeRelevance({
      oblasti: v.oblasti,
      zdroj: v.zdroj,
      nazev: v.nazev,
      popis: v.popis,
      plnyText: v.plnyText,
    }),
  }));

  return NextResponse.json({ vyzvy: serialized, total, limit, offset });
}
