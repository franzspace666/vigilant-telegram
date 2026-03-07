import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateDefaultZadatel } from "@/lib/defaultZadatel";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const zadatelId = body.zadatelId || "default-zadatel";
  await getOrCreateDefaultZadatel();

  const nastaveni = await prisma.nastaveni.upsert({
    where: { zadatelId },
    update: {
      emailNotifikace: body.emailNotifikace ?? undefined,
      smsNotifikace: body.smsNotifikace ?? undefined,
      pushNotifikace: body.pushNotifikace ?? undefined,
      frekvence: body.frekvence ?? undefined,
      minRelevance: body.minRelevance ?? undefined,
      dniPredDeadline: body.dniPredDeadline ?? undefined,
      sledovaneZdroje: body.sledovaneZdroje ?? undefined,
    },
    create: {
      zadatelId,
      emailNotifikace: body.emailNotifikace ?? true,
      smsNotifikace: body.smsNotifikace ?? false,
      pushNotifikace: body.pushNotifikace ?? false,
      frekvence: body.frekvence ?? "denne",
      minRelevance: body.minRelevance ?? 60,
      dniPredDeadline: body.dniPredDeadline ?? 14,
      sledovaneZdroje: body.sledovaneZdroje ?? ["SZIF", "SFZP", "EAGRI"],
    },
  });

  return NextResponse.json(nastaveni);
}
