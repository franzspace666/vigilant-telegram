import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serializeVyzva } from "@/lib/types";
import { DEFAULT_ZADATEL_ID } from "@/lib/defaultZadatel";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const vyzva = await prisma.vyzva.findUnique({
    where: { id },
    include: {
      ulozene: {
        where: { zadatelId: DEFAULT_ZADATEL_ID },
        select: { id: true, poznamka: true, relevance: true },
      },
    },
  });

  if (!vyzva) {
    return NextResponse.json({ error: "Výzva nenalezena" }, { status: 404 });
  }

  return NextResponse.json({
    ...serializeVyzva(vyzva),
    ulozene: vyzva.ulozene,
  });
}
