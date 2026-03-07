import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateDefaultZadatel } from "@/lib/defaultZadatel";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ zadatelId: string }> }
) {
  const { zadatelId } = await params;
  await getOrCreateDefaultZadatel();

  const nastaveni = await prisma.nastaveni.upsert({
    where: { zadatelId },
    update: {},
    create: {
      zadatelId,
      emailNotifikace: true,
      smsNotifikace: false,
      pushNotifikace: false,
      frekvence: "denne",
      minRelevance: 60,
      dniPredDeadline: 14,
      sledovaneZdroje: ["SZIF", "SFZP", "EAGRI"],
    },
  });

  return NextResponse.json(nastaveni);
}
