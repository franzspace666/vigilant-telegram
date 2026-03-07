import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeVyzva } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ zadatelId: string }> }
) {
  const { zadatelId } = await params;

  const ulozene = await prisma.ulozenaVyzva.findMany({
    where: { zadatelId },
    include: { vyzva: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ulozene.map((u: any) => ({
      ...u,
      vyzva: serializeVyzva(u.vyzva),
    }))
  );
}
