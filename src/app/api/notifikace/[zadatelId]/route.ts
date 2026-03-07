import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeVyzva } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ zadatelId: string }> }
) {
  const { zadatelId } = await params;

  const notifikace = await prisma.notifikace.findMany({
    where: { zadatelId },
    include: { vyzva: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notifikace.map((n: any) => ({
      ...n,
      createdAt: n.createdAt?.toISOString?.() ?? n.createdAt,
      vyzva: n.vyzva ? serializeVyzva(n.vyzva) : null,
    }))
  );
}
