import { NextRequest, NextResponse } from "next/server";

// Mapování kódů právních forem z ARES na hodnoty v aplikaci
// Zdroj: Číselník právních forem ARES / Registr ekonomických subjektů
const pravniFormyMap: Record<string, string> = {
  "101": "Fyzická osoba",
  "102": "Fyzická osoba",
  "104": "OSVČ",
  "105": "OSVČ",
  "106": "OSVČ",
  "107": "OSVČ",
  "108": "OSVČ",
  "109": "OSVČ",
  "111": "s.r.o.", // veřejná obchodní společnost – nejbližší
  "112": "s.r.o.",
  "113": "s.r.o.", // komanditní
  "121": "a.s.",
  "141": "spolek",
  "145": "spolek",
  "151": "spolek", // obecně prospěšná společnost
  "161": "spolek", // nadace
  "231": "obec",
  "232": "obec",
  "311": "příspěvková organizace",
  "312": "příspěvková organizace",
  "331": "příspěvková organizace",
  "332": "příspěvková organizace",
  "421": "družstvo",
  "422": "družstvo",
  "601": "Fyzická osoba",
  "641": "OSVČ",
  "642": "OSVČ",
  "643": "OSVČ",
};

// Normalizace kraje – ARES vrací „Královéhradecký kraj", aplikace používá „Královéhradecký"
function normalizeKraj(nazevKraje: string): string {
  return nazevKraje
    .replace(/ kraj$/i, "")
    .replace("Hlavní město", "Hlavní město")
    .trim();
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ico = searchParams.get("ico")?.trim().replace(/\s/g, "");

  if (!ico || !/^\d{7,8}$/.test(ico)) {
    return NextResponse.json({ error: "Neplatné IČO – musí mít 7 nebo 8 číslic" }, { status: 400 });
  }

  // Doplnit na 8 číslic vedoucí nulou (pro fyzické osoby s 7místným IČO)
  const icoNormalized = ico.padStart(8, "0");

  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${icoNormalized}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 }, // cache 1 hodinu
      }
    );

    if (res.status === 404) {
      return NextResponse.json({ error: "Subjekt s tímto IČO nebyl nalezen v ARES" }, { status: 404 });
    }

    if (!res.ok) {
      return NextResponse.json({ error: "Chyba při komunikaci s ARES" }, { status: 502 });
    }

    const data = await res.json();

    // ARES vrací pravniForma jako číselný kód (string nebo number)
    const pravniFormaKod = String(data.pravniForma ?? "");
    const pravniForma = pravniFormyMap[pravniFormaKod] ?? "";

    const krajRaw = data.sidlo?.nazevKraje ?? "";
    const kraj = krajRaw ? normalizeKraj(krajRaw) : "";

    return NextResponse.json({
      nazev: data.obchodniJmeno ?? "",
      pravniForma,
      kraj,
      obec: data.sidlo?.nazevObce ?? "",
      okres: data.sidlo?.nazevOkresu?.replace(/ okres$/i, "") ?? "",
      pravniFormaKod, // původní kód z ARES pro debugging
    });
  } catch {
    return NextResponse.json({ error: "Nepodařilo se připojit k ARES" }, { status: 502 });
  }
}
