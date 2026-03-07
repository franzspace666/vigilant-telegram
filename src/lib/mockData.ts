export interface Vyzva {
  id: string;
  nazev: string;
  zdroj: string;
  oblast: string[];
  alokace: string;
  deadline: string;
  popis: string;
  relevance: number;
  status: "open" | "closing" | "planned" | "closed";
  url: string;
  datumVyhlaseni: string;
  minCastka: string;
  maxCastka: string;
  miraSpolufinancovani: string;
}

export const vyzvy: Vyzva[] = [
  {
    id: "szif-agroturistika-2026",
    nazev: "Podpora agroturistiky v horských oblastech",
    zdroj: "SZIF",
    oblast: ["Cestovní ruch", "Zemědělství"],
    alokace: "250 mil. Kč",
    deadline: "2026-04-30",
    popis:
      "Výzva zaměřená na rozvoj agroturistických služeb v horských a podhorských oblastech ČR. Podporovány jsou investice do ubytovacích kapacit na farmách, zřizování naučných stezek, ukázkových hospodářství a programů pro návštěvníky spojených se zemědělskou činností. Zvýhodněny jsou projekty v oblastech s omezenými přírodními podmínkami (LFA).",
    relevance: 95,
    status: "open",
    url: "https://www.szif.cz/cs/prv-agroturistika-2026",
    datumVyhlaseni: "2026-01-15",
    minCastka: "500 tis. Kč",
    maxCastka: "5 mil. Kč",
    miraSpolufinancovani: "50 %",
  },
  {
    id: "sfzp-bioplyn-2026",
    nazev: "Podpora bioplynových stanic z odpadní biomasy",
    zdroj: "SFŽP",
    oblast: ["Energetika", "Bioplyn"],
    alokace: "800 mil. Kč",
    deadline: "2026-06-15",
    popis:
      "Program na podporu výstavby a modernizace bioplynových stanic zpracovávajících odpadní biomasu ze zemědělské výroby. Cílem je snížení emisí metanu, podpora cirkulární ekonomiky a zvýšení energetické soběstačnosti zemědělských podniků. Preferovány jsou projekty využívající kogeneraci a napojení na lokální distribuční soustavu.",
    relevance: 88,
    status: "open",
    url: "https://www.sfzp.cz/dotace/bioplyn-2026",
    datumVyhlaseni: "2026-02-01",
    minCastka: "2 mil. Kč",
    maxCastka: "25 mil. Kč",
    miraSpolufinancovani: "45 %",
  },
  {
    id: "prv-mleko-syry-2026",
    nazev: "Zpracování mléka a výroba farmářských sýrů",
    zdroj: "PRV / eAGRI",
    oblast: ["Zpracování produkce", "Lokální potraviny"],
    alokace: "180 mil. Kč",
    deadline: "2026-03-31",
    popis:
      "Výzva z Programu rozvoje venkova na podporu malých a středních zpracovatelů mléka. Podporovány jsou investice do mlékárenského vybavení, pasterizačních linek, sýráren, zracích sklepů a balicích technologií. Podmínkou je zpracování min. 60 % mléka z vlastní produkce nebo od lokálních dodavatelů do 50 km.",
    relevance: 91,
    status: "closing",
    url: "https://eagri.cz/public/web/mze/dotace/prv-mleko-2026",
    datumVyhlaseni: "2025-12-01",
    minCastka: "300 tis. Kč",
    maxCastka: "8 mil. Kč",
    miraSpolufinancovani: "55 %",
  },
  {
    id: "mas-krkonose-reg-2026",
    nazev: "Regionální značky a produkty Krkonoš",
    zdroj: "MAS Krkonoše",
    oblast: ["Regionální produkt", "Lokální potraviny"],
    alokace: "12 mil. Kč",
    deadline: "2026-05-15",
    popis:
      "Podpora propagace a marketingu regionálních produktů nesoucích značku Krkonoše – originální produkt. Podporovány jsou náklady na certifikaci, propagační materiály, účast na farmářských trzích, vytvoření e-shopu a společné marketingové kampaně producentů z oblasti Krkonoš.",
    relevance: 82,
    status: "open",
    url: "https://mas-krkonose.cz/vyzvy/regionalni-znacky-2026",
    datumVyhlaseni: "2026-01-20",
    minCastka: "50 tis. Kč",
    maxCastka: "800 tis. Kč",
    miraSpolufinancovani: "70 %",
  },
  {
    id: "aopk-krajina-krnap-2026",
    nazev: "Obnova krajiny a biodiverzity v KRNAP",
    zdroj: "AOPK",
    oblast: ["Zemědělství", "Regionální produkt"],
    alokace: "95 mil. Kč",
    deadline: "2026-07-01",
    popis:
      "Program zaměřený na obnovu degradovaných krajinných prvků v Krkonošském národním parku a jeho ochranném pásmu. Podporovány jsou opatření na revitalizaci mokřadů, obnovu tradičních luk a pastvin, výsadbu původních dřevin a budování tůní. Žadateli mohou být vlastníci a správci pozemků v území KRNAP.",
    relevance: 76,
    status: "open",
    url: "https://www.dotace.nature.cz/krnap-krajina-2026",
    datumVyhlaseni: "2026-03-01",
    minCastka: "200 tis. Kč",
    maxCastka: "3 mil. Kč",
    miraSpolufinancovani: "80 %",
  },
  {
    id: "eagri-staje-2026",
    nazev: "Modernizace stájí a ustájovacích prostor",
    zdroj: "eAGRI",
    oblast: ["Zemědělství"],
    alokace: "450 mil. Kč",
    deadline: "2026-04-15",
    popis:
      "Investiční podpora modernizace stájových objektů pro chov hospodářských zvířat. Zahrnuje rekonstrukce podlah, ventilačních systémů, napájecích technologií, krmných automatů a systémů pro zajištění welfare zvířat. Zvýhodněny jsou projekty v horských oblastech s chovem skotu na trvalých travních porostech.",
    relevance: 85,
    status: "open",
    url: "https://eagri.cz/public/web/mze/dotace/staje-2026",
    datumVyhlaseni: "2026-01-10",
    minCastka: "1 mil. Kč",
    maxCastka: "15 mil. Kč",
    miraSpolufinancovani: "50 %",
  },
  {
    id: "modfond-fve-farmy-2026",
    nazev: "Fotovoltaické systémy pro zemědělské podniky",
    zdroj: "Modernizační fond",
    oblast: ["Energetika", "Zemědělství"],
    alokace: "1,2 mld. Kč",
    deadline: "2026-08-31",
    popis:
      "Podpora instalace fotovoltaických elektráren na střechách zemědělských budov a přilehlých plochách. Součástí může být bateriové úložiště a systém řízení spotřeby. Podmínkou je min. 70% vlastní spotřeba vyrobené energie. Bonifikace za kombinaci s tepelným čerpadlem nebo nabíjecí stanicí pro elektromobily.",
    relevance: 79,
    status: "planned",
    url: "https://www.modernizacni-fond.cz/fve-zemedelstvi-2026",
    datumVyhlaseni: "2026-04-01",
    minCastka: "500 tis. Kč",
    maxCastka: "10 mil. Kč",
    miraSpolufinancovani: "50 %",
  },
  {
    id: "mas-pobejt-marketing-2026",
    nazev: "Marketing lokálních produktů a služeb",
    zdroj: "MAS Přijďte pobejt",
    oblast: ["Lokální potraviny", "Cestovní ruch"],
    alokace: "8 mil. Kč",
    deadline: "2026-05-31",
    popis:
      "Výzva na podporu marketingových aktivit lokálních producentů a poskytovatelů služeb v oblasti MAS Přijďte pobejt. Podporovány jsou společné propagační kampaně, tvorba webových prezentací, fotografické a video materiály, účast na veletrzích a organizace degustačních akcí.",
    relevance: 74,
    status: "open",
    url: "https://www.prijdtepobejt.cz/vyzvy/marketing-2026",
    datumVyhlaseni: "2026-02-15",
    minCastka: "30 tis. Kč",
    maxCastka: "500 tis. Kč",
    miraSpolufinancovani: "75 %",
  },
  {
    id: "sfzp-zatepleni-penzionu-2026",
    nazev: "Zateplení a energetické úspory penzionů",
    zdroj: "SFŽP",
    oblast: ["Ubytování", "Energetika"],
    alokace: "350 mil. Kč",
    deadline: "2026-03-15",
    popis:
      "Program na snížení energetické náročnosti ubytovacích zařízení typu penzion a turistická ubytovna. Podporovány jsou komplexní zateplení obálky budovy, výměna oken a dveří, modernizace vytápění a přípravy TUV, instalace rekuperace. Podmínkou je dosažení min. 30% úspory celkové dodané energie.",
    relevance: 68,
    status: "closing",
    url: "https://www.sfzp.cz/dotace/zatepleni-penzionu-2026",
    datumVyhlaseni: "2025-11-15",
    minCastka: "500 tis. Kč",
    maxCastka: "6 mil. Kč",
    miraSpolufinancovani: "40 %",
  },
  {
    id: "mmr-agroturistika-2026",
    nazev: "Podpora agroturistiky a venkovského cestovního ruchu",
    zdroj: "MMR",
    oblast: ["Cestovní ruch", "Ubytování", "Zemědělství"],
    alokace: "200 mil. Kč",
    deadline: "2026-06-30",
    popis:
      "Dotační titul na rozvoj agroturistiky a venkovského cestovního ruchu. Podporovány jsou investice do rekonstrukce budov pro ubytování turistů na farmách, zřizování jízdáren, stezek pro hipoturistiku, outdoorových zážitkových programů a infrastruktury pro cykloturistiku v zemědělské krajině.",
    relevance: 86,
    status: "open",
    url: "https://www.mmr.cz/cs/dotace/agroturistika-2026",
    datumVyhlaseni: "2026-02-10",
    minCastka: "1 mil. Kč",
    maxCastka: "12 mil. Kč",
    miraSpolufinancovani: "50 %",
  },
  {
    id: "szif-zivocisna-hory-2026",
    nazev: "Živočišná výroba v horských oblastech",
    zdroj: "SZIF",
    oblast: ["Zemědělství"],
    alokace: "320 mil. Kč",
    deadline: "2026-05-01",
    popis:
      "Speciální výzva pro podniky provozující živočišnou výrobu v oblastech s přírodním omezením (ANC horské). Podporovány jsou investice do zlepšení podmínek chovu, nákup plemenných zvířat, pořízení manipulační techniky a vybavení pastevních areálů. Bonifikace za ekologické zemědělství a chov původních plemen.",
    relevance: 90,
    status: "open",
    url: "https://www.szif.cz/cs/prv-zivocisna-hory-2026",
    datumVyhlaseni: "2026-01-25",
    minCastka: "400 tis. Kč",
    maxCastka: "10 mil. Kč",
    miraSpolufinancovani: "60 %",
  },
  {
    id: "mpo-komunitni-energetika-2026",
    nazev: "Komunitní energetika – sdílení energie",
    zdroj: "MPO",
    oblast: ["Energetika"],
    alokace: "500 mil. Kč",
    deadline: "2026-09-30",
    popis:
      "Pilotní program na podporu vzniku energetických společenství a komunitních energetických projektů. Podporovány jsou instalace sdílených OZE, akumulační systémy, chytré sítě pro řízení spotřeby a organizační náklady na založení energetického společenství. Přednost mají projekty v obcích do 3 000 obyvatel.",
    relevance: 62,
    status: "planned",
    url: "https://www.mpo.cz/cz/dotace/komunitni-energetika-2026",
    datumVyhlaseni: "2026-05-01",
    minCastka: "1 mil. Kč",
    maxCastka: "20 mil. Kč",
    miraSpolufinancovani: "45 %",
  },
  {
    id: "khk-venkov-2026",
    nazev: "Program obnovy venkova Královéhradeckého kraje",
    zdroj: "Královéhradecký kraj",
    oblast: ["Cestovní ruch", "Regionální produkt"],
    alokace: "30 mil. Kč",
    deadline: "2026-03-01",
    popis:
      "Krajský dotační program zaměřený na podporu venkovských obcí a podnikatelů. Podporovány jsou opravy veřejných prostranství, obnova kulturního dědictví, podpora lokálních řemeslníků a drobné infrastrukturní projekty zvyšující atraktivitu venkova pro turisty i rezidenty.",
    relevance: 55,
    status: "closing",
    url: "https://www.kr-kralovehradecky.cz/dotace/venkov-2026",
    datumVyhlaseni: "2025-12-15",
    minCastka: "100 tis. Kč",
    maxCastka: "1,5 mil. Kč",
    miraSpolufinancovani: "60 %",
  },
  {
    id: "opzp-voda-krajina-2026",
    nazev: "Retence vody v krajině a protipovodňová opatření",
    zdroj: "OPŽP",
    oblast: ["Zemědělství"],
    alokace: "600 mil. Kč",
    deadline: "2026-10-15",
    popis:
      "Výzva na podporu přírodě blízkých protipovodňových opatření a zvýšení retence vody v zemědělské krajině. Podporovány jsou stavby suchých poldrů, revitalizace vodních toků, budování remízků a mezí, zasakovacích průlehů a obnova rybníků. Žadateli mohou být obce, zemědělci i správci povodí.",
    relevance: 48,
    status: "planned",
    url: "https://www.opzp.cz/vyzvy/retence-vody-2026",
    datumVyhlaseni: "2026-06-01",
    minCastka: "500 tis. Kč",
    maxCastka: "30 mil. Kč",
    miraSpolufinancovani: "85 %",
  },
];

export function getVyzvaById(id: string): Vyzva | undefined {
  return vyzvy.find((v) => v.id === id);
}

export function formatDeadline(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" });
}

export function daysUntilDeadline(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr);
  deadline.setHours(0, 0, 0, 0);
  return Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export const statusLabels: Record<string, string> = {
  open: "Otevřená",
  closing: "Končí brzy",
  planned: "Plánovaná",
  closed: "Uzavřená",
};

export const zdrojeList = [
  "SZIF", "eAGRI", "SFŽP", "OPŽP", "AOPK", "MAS Krkonoše",
  "MAS Přijďte pobejt", "KRNAP", "Královéhradecký kraj", "MPO", "MMR",
  "PRV / eAGRI", "Modernizační fond",
];

export const oblastiList = [
  "Zemědělství", "Zpracování produkce", "Lokální potraviny",
  "Regionální produkt", "Energetika", "Bioplyn",
  "Cestovní ruch", "Ubytování",
];
