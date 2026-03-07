import { prisma } from "@/lib/db";

export const DEFAULT_ZADATEL_ID = "default-zadatel";

export async function getOrCreateDefaultZadatel() {
  return prisma.zadatel.upsert({
    where: { id: DEFAULT_ZADATEL_ID },
    update: {},
    create: {
      id: DEFAULT_ZADATEL_ID,
      nazev: "Výchozí žadatel",
      pravniForma: "",
      kraj: "",
      velikost: "",
      sektory: [],
      specifickaOblast: [],
      klicovaSlova: [],
    },
  });
}
