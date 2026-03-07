import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeVyzva } from "@/lib/types";

export async function GET() {
  const now = new Date();
  const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalActive,
    approachingDeadlines,
    distinctZdroje,
    newThisMonth,
    recentGrants,
    upcomingDeadlines,
    allActive,
  ] = await Promise.all([
    prisma.vyzva.count({ where: { status: "otevrena" } }),
    prisma.vyzva.count({
      where: {
        status: "otevrena",
        deadline: { gte: now, lte: fourteenDaysFromNow },
      },
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      select: { zdroj: true },
      distinct: ["zdroj"],
    }),
    prisma.vyzva.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.vyzva.findMany({
      where: {
        status: "otevrena",
        deadline: { gte: now },
      },
      orderBy: { deadline: "asc" },
      take: 5,
    }),
    prisma.vyzva.findMany({
      where: { status: "otevrena" },
      select: { oblasti: true },
    }),
  ]);

  // Group by oblasti in JS (because oblasti is String[])
  const oblastCounts: Record<string, number> = {};
  for (const v of allActive) {
    for (const o of v.oblasti) {
      oblastCounts[o] = (oblastCounts[o] || 0) + 1;
    }
  }
  const oblastDistribution = Object.entries(oblastCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  return NextResponse.json({
    totalActive,
    approachingDeadlines,
    distinctZdroje: distinctZdroje.length,
    newThisMonth,
    recentGrants: recentGrants.map(serializeVyzva),
    upcomingDeadlines: upcomingDeadlines.map(serializeVyzva),
    oblastDistribution,
  });
}
