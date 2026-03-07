import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const zdroj = searchParams.get("zdroj");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") || "100");
  const offset = parseInt(searchParams.get("offset") || "0");

  const where: Record<string, unknown> = { typZaznamu: "dokument" };

  if (zdroj) where.zdroj = zdroj;
  if (search) where.nazev = { contains: search, mode: "insensitive" };

  const [dokumenty, total] = await Promise.all([
    prisma.vyzva.findMany({
      where,
      select: {
        id: true,
        nazev: true,
        zdroj: true,
        zdrojUrl: true,
        popis: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.vyzva.count({ where }),
  ]);

  return NextResponse.json({ dokumenty, total, limit, offset });
}
