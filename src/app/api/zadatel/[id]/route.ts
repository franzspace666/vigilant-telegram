import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const zadatel = await prisma.zadatel.findUnique({
    where: { id },
    include: { nastaveni: true },
  });

  if (!zadatel) {
    return NextResponse.json(null);
  }

  return NextResponse.json(zadatel);
}
