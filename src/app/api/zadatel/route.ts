import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, nazev, ico, pravniForma, kraj, okres, obec, specifickaOblast, sektory, klicovaSlova, velikost, email, telefon } = body;

  const zadatel = await prisma.zadatel.upsert({
    where: { id: id || "default-zadatel" },
    update: {
      nazev: nazev ?? undefined,
      ico: ico ?? undefined,
      pravniForma: pravniForma ?? undefined,
      kraj: kraj ?? undefined,
      okres: okres ?? undefined,
      obec: obec ?? undefined,
      specifickaOblast: specifickaOblast ?? undefined,
      sektory: sektory ?? undefined,
      klicovaSlova: klicovaSlova ?? undefined,
      velikost: velikost ?? undefined,
      email: email ?? undefined,
      telefon: telefon ?? undefined,
    },
    create: {
      id: id || "default-zadatel",
      nazev: nazev || "",
      pravniForma: pravniForma || "",
      kraj: kraj || "",
      velikost: velikost || "",
      ico,
      okres,
      obec,
      specifickaOblast: specifickaOblast || [],
      sektory: sektory || [],
      klicovaSlova: klicovaSlova || [],
      email,
      telefon,
    },
  });

  return NextResponse.json(zadatel);
}
