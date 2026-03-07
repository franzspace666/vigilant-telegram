import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ ico: string }> }
) {
  const { ico } = await params;

  if (!/^\d{8}$/.test(ico)) {
    return NextResponse.json(
      { error: "Neplatné IČO – musí mít 8 číslic" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.status === 404) {
      return NextResponse.json(
        { error: "Subjekt s tímto IČO nebyl nalezen" },
        { status: 404 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Chyba při komunikaci s ARES" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // pravniForma může být string kód ("121") nebo objekt ({ kodPravniFormy: 121 })
    let pravniFormaKod = "";
    if (typeof data.pravniForma === "string") {
      pravniFormaKod = data.pravniForma;
    } else if (typeof data.pravniForma === "number") {
      pravniFormaKod = String(data.pravniForma);
    } else if (data.pravniForma?.kodPravniFormy != null) {
      pravniFormaKod = String(data.pravniForma.kodPravniFormy);
    }

    return NextResponse.json({
      obchodniJmeno: data.obchodniJmeno || "",
      pravniForma: pravniFormaKod,
      sidlo: {
        nazevKraje: data.sidlo?.nazevKraje || "",
        nazevOkresu: data.sidlo?.nazevOkresu || "",
        nazevObce: data.sidlo?.nazevObce || "",
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "ARES neodpovídá, zkuste to znovu" },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Nepodařilo se spojit s ARES" },
      { status: 502 }
    );
  }
}
