import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateDefaultZadatel } from "@/lib/defaultZadatel";

export async function POST(request: NextRequest) {
  const { zadatelId, vyzvaId, poznamka } = await request.json();
  await getOrCreateDefaultZadatel();

  const ulozena = await prisma.ulozenaVyzva.upsert({
    where: {
      zadatelId_vyzvaId: {
        zadatelId: zadatelId || "default-zadatel",
        vyzvaId,
      },
    },
    update: { poznamka },
    create: {
      zadatelId: zadatelId || "default-zadatel",
      vyzvaId,
      poznamka,
    },
  });

  return NextResponse.json(ulozena);
}

export async function DELETE(request: NextRequest) {
  const { zadatelId, vyzvaId } = await request.json();

  await prisma.ulozenaVyzva.delete({
    where: {
      zadatelId_vyzvaId: {
        zadatelId: zadatelId || "default-zadatel",
        vyzvaId,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
