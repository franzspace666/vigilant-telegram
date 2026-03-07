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
  typZadatele: string[];
  cisloVyzvy?: string;
  kolo?: string;
  podminkyUrl?: string;
}

export const typyZadatelu = [
  "Zemědělec",
  "OSVČ",
  "Fyzická osoba",
  "MSP",
  "Velký podnik",
  "Obec",
  "Nezisková org.",
  "Výzkumná org.",
  "Příspěvková org.",
];

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
    typZadatele: ["Zemědělec", "OSVČ", "MSP"],
    cisloVyzvy: "5/2026/PRV",
    kolo: "1. kolo",
    podminkyUrl: "https://www.szif.cz/cs/prv-agroturistika-2026/pravidla",
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
    typZadatele: ["Zemědělec", "MSP", "Velký podnik"],
    cisloVyzvy: "3/2026/BPS",
    kolo: "průběžné",
    podminkyUrl: "https://www.sfzp.cz/dotace/bioplyn-2026/podmínky",
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
    typZadatele: ["Zemědělec", "OSVČ", "MSP"],
    cisloVyzvy: "1/2026/PRV-ZP",
    kolo: "2. kolo",
    podminkyUrl: "https://eagri.cz/public/web/mze/dotace/prv-mleko-2026/pravidla.pdf",
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
    typZadatele: ["MSP", "OSVČ", "Fyzická osoba"],
    cisloVyzvy: "2/2026/CLLD",
    kolo: "1. kolo",
    podminkyUrl: "https://mas-krkonose.cz/vyzvy/regionalni-znacky-2026/fiche",
  },
  {
    id: "aopk-krajina-krnap-2026",
    nazev: "Obnova krajiny a biodiverzity v KRNAP",
    zdroj: "AOPK",
    oblast: ["Zemědělství", "Životní prostředí"],
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
    typZadatele: ["Zemědělec", "Fyzická osoba", "Obec"],
    cisloVyzvy: "1/2026/KRNAP",
    kolo: "průběžné",
    podminkyUrl: "https://www.dotace.nature.cz/krnap-krajina-2026/podminky",
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
    typZadatele: ["Zemědělec", "MSP"],
    cisloVyzvy: "7/2026/PRV",
    kolo: "1. kolo",
    podminkyUrl: "https://eagri.cz/public/web/mze/dotace/staje-2026/pravidla",
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
    typZadatele: ["Zemědělec", "MSP", "Velký podnik"],
    cisloVyzvy: "12/2026/FVE-ZEM",
    kolo: "průběžné",
    podminkyUrl: "https://www.modernizacni-fond.cz/fve-zemedelstvi-2026/podminky",
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
    typZadatele: ["MSP", "OSVČ", "Fyzická osoba"],
    cisloVyzvy: "3/2026/CLLD",
    kolo: "1. kolo",
    podminkyUrl: "https://www.prijdtepobejt.cz/vyzvy/marketing-2026/fiche",
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
    typZadatele: ["MSP", "OSVČ", "Fyzická osoba"],
    cisloVyzvy: "11/2026/ENERG",
    kolo: "2. kolo",
    podminkyUrl: "https://www.sfzp.cz/dotace/zatepleni-penzionu-2026/podmínky",
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
    typZadatele: ["Zemědělec", "MSP", "OSVČ"],
    cisloVyzvy: "2/2026/CR",
    kolo: "1. kolo",
    podminkyUrl: "https://www.mmr.cz/cs/dotace/agroturistika-2026/pravidla",
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
    typZadatele: ["Zemědělec"],
    cisloVyzvy: "8/2026/ZV",
    kolo: "1. kolo",
    podminkyUrl: "https://www.szif.cz/cs/prv-zivocisna-hory-2026/pravidla",
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
    typZadatele: ["Obec", "MSP", "Nezisková org."],
    cisloVyzvy: "1/2026/KE",
    kolo: "1. kolo",
    podminkyUrl: "https://www.mpo.cz/cz/dotace/komunitni-energetika-2026/podminky",
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
    typZadatele: ["Obec", "MSP", "OSVČ", "Nezisková org."],
    cisloVyzvy: "4/2026/POV",
    kolo: "průběžné",
    podminkyUrl: "https://www.kr-kralovehradecky.cz/dotace/venkov-2026/zasady",
  },
  {
    id: "opzp-voda-krajina-2026",
    nazev: "Retence vody v krajině a protipovodňová opatření",
    zdroj: "OPŽP",
    oblast: ["Zemědělství", "Životní prostředí"],
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
    typZadatele: ["Obec", "Zemědělec", "Nezisková org."],
    cisloVyzvy: "15/2026/OPŽP",
    kolo: "průběžné",
    podminkyUrl: "https://www.opzp.cz/vyzvy/retence-vody-2026/text-vyzvy",
  },
  {
    id: "optak-digitalizace-msp-2026",
    nazev: "Digitalizace podniků – Aplikace a služby",
    zdroj: "OP TAK / CzechInvest",
    oblast: ["Digitalizace", "Zpracování produkce"],
    alokace: "1,5 mld. Kč",
    deadline: "2026-05-31",
    popis:
      "Výzva z Operačního programu Technologie a aplikace pro konkurenceschopnost (OP TAK) zaměřená na digitalizaci malých a středních podniků. Podporovány jsou pořízení digitálních technologií, ERP a CRM systémů, automatizace výrobních procesů, cloudové nástroje a kybernetická bezpečnost. Prioritou jsou firmy ze zpracovatelského průmyslu a agropodnikání.",
    relevance: 72,
    status: "open",
    url: "https://www.czechinvest.org/cz/Sluzby-pro-firmy/Dotace/Optak/Digitalizace-podniku",
    datumVyhlaseni: "2026-01-20",
    minCastka: "500 tis. Kč",
    maxCastka: "30 mil. Kč",
    miraSpolufinancovani: "45 %",
    typZadatele: ["MSP"],
    cisloVyzvy: "OPPIK-DIGIT-2026-01",
    kolo: "1. kolo",
    podminkyUrl: "https://www.czechinvest.org/cz/Sluzby-pro-firmy/Dotace/Optak/Digitalizace-podniku/Dokumenty",
  },
  {
    id: "optak-inovacni-vouchery-2026",
    nazev: "Inovační vouchery pro MSP",
    zdroj: "OP TAK / CzechInvest",
    oblast: ["Digitalizace"],
    alokace: "400 mil. Kč",
    deadline: "2026-06-30",
    popis:
      "Zjednodušená výzva pro malé a střední podniky na nákup inovačních služeb od výzkumných organizací, univerzit nebo konzultantů. Vouchery jsou určeny na zavádění nových technologií, produktový design, prototypování nebo analýzu nových trhů. Rychlé hodnocení, minimální administrativa.",
    relevance: 60,
    status: "open",
    url: "https://www.czechinvest.org/cz/Sluzby-pro-firmy/Dotace/Optak/Inovacni-vouchery",
    datumVyhlaseni: "2026-02-01",
    minCastka: "50 tis. Kč",
    maxCastka: "1 mil. Kč",
    miraSpolufinancovani: "50 %",
    typZadatele: ["MSP", "Fyzická osoba"],
    cisloVyzvy: "INNO-VCH-2026-4",
    kolo: "průběžné",
    podminkyUrl: "https://www.czechinvest.org/cz/Sluzby-pro-firmy/Dotace/Optak/Inovacni-vouchery/Dokumenty",
  },
  {
    id: "npo-ubytovani-cestovni-ruch-2026",
    nazev: "Modernizace ubytovacích kapacit – NPO",
    zdroj: "NPO / MMR",
    oblast: ["Cestovní ruch", "Ubytování"],
    alokace: "500 mil. Kč",
    deadline: "2026-07-31",
    popis:
      "Výzva z Národního plánu obnovy na modernizaci a rozšíření kapacit ubytovacích zařízení v destinacích s přidanou hodnotou pro cestovní ruch. Podporovány jsou rekonstrukce hotelů, penzionů a turistických ubytoven, jejich energetická obnova a digitalizace rezervačních systémů. Důraz na udržitelnost a přístupnost pro osoby se zdravotním postižením.",
    relevance: 80,
    status: "open",
    url: "https://www.mmr.cz/cs/narodni-plan-obnovy/ubytovani",
    datumVyhlaseni: "2026-03-15",
    minCastka: "1 mil. Kč",
    maxCastka: "10 mil. Kč",
    miraSpolufinancovani: "50 %",
    typZadatele: ["MSP", "OSVČ", "Fyzická osoba"],
    cisloVyzvy: "NPO-CR-2026-1",
    kolo: "1. kolo",
    podminkyUrl: "https://www.mmr.cz/cs/narodni-plan-obnovy/ubytovani/podminky",
  },
  {
    id: "npo-zelen-agrotech-2026",
    nazev: "Zelené agrotechnologie a precizní zemědělství",
    zdroj: "NPO / MZe",
    oblast: ["Zemědělství", "Digitalizace"],
    alokace: "700 mil. Kč",
    deadline: "2026-09-15",
    popis:
      "Výzva zaměřená na zavádění digitálních a precizních technologií do zemědělství. Podporovány jsou systémy pro monitorování půdy a plodin, drony pro monitoring porostů, automatizované závlahy, senzorické sítě a software pro řízení zemědělského podniku. Cílem je zvýšení efektivity a snížení environmentální zátěže.",
    relevance: 83,
    status: "planned",
    url: "https://eagri.cz/public/web/mze/dotace/npo-agrotechnologie-2026",
    datumVyhlaseni: "2026-05-01",
    minCastka: "300 tis. Kč",
    maxCastka: "8 mil. Kč",
    miraSpolufinancovani: "60 %",
    typZadatele: ["Zemědělec", "MSP"],
    cisloVyzvy: "NPO-MZe-AT-2026-1",
    kolo: "1. kolo",
    podminkyUrl: "https://eagri.cz/public/web/mze/dotace/npo-agrotechnologie-2026/pravidla",
  },
  {
    id: "irop-cykloinfrastruktura-2026",
    nazev: "Cykloinfrastruktura a doprovodné služby",
    zdroj: "IROP",
    oblast: ["Infrastruktura", "Cestovní ruch"],
    alokace: "900 mil. Kč",
    deadline: "2026-08-31",
    popis:
      "Výzva z Integrovaného regionálního operačního programu na výstavbu a rekonstrukci cyklostezek, cyklotras a doprovodné infrastruktury. Podporovány jsou nové cyklostezky, opravy stávajících tras, odpočívadla, půjčovny kol, stojany a navigační systémy. Projekty musí být napojeny na síť EuroVelo nebo na místní síť tras.",
    relevance: 66,
    status: "open",
    url: "https://www.irop.mmr.cz/cs/Vyzvy/Detail/cykloinfrastruktura-2026",
    datumVyhlaseni: "2026-02-20",
    minCastka: "1 mil. Kč",
    maxCastka: "50 mil. Kč",
    miraSpolufinancovani: "85 %",
    typZadatele: ["Obec", "MSP", "Nezisková org."],
    cisloVyzvy: "IROP-CLLD-SC5.1-2026-2",
    kolo: "2. kolo",
    podminkyUrl: "https://www.irop.mmr.cz/cs/Vyzvy/Detail/cykloinfrastruktura-2026/Text-vyzvy",
  },
  {
    id: "irop-venkovska-infrastruktura-2026",
    nazev: "Infrastruktura pro rozvoj venkova a obcí do 2 000 ob.",
    zdroj: "IROP",
    oblast: ["Infrastruktura"],
    alokace: "1,2 mld. Kč",
    deadline: "2026-11-30",
    popis:
      "Podpora projektů zaměřených na budování a obnovu základní infrastruktury venkovských obcí. Zahrnuje rekonstrukce místních komunikací, budování chodníků, opravy mostů, odkanalizování a vodovody. Prioritní jsou projekty přispívající ke klimatické odolnosti nebo napojení na páteřní komunikace.",
    relevance: 38,
    status: "planned",
    url: "https://www.irop.mmr.cz/cs/Vyzvy/Detail/venkovska-infrastruktura-2026",
    datumVyhlaseni: "2026-07-01",
    minCastka: "500 tis. Kč",
    maxCastka: "15 mil. Kč",
    miraSpolufinancovani: "80 %",
    typZadatele: ["Obec"],
    cisloVyzvy: "IROP-SC6.1-2026-5",
    kolo: "průběžné",
    podminkyUrl: "https://www.irop.mmr.cz/cs/Vyzvy/Detail/venkovska-infrastruktura-2026/Text-vyzvy",
  },
  {
    id: "esfplus-vzdelavani-zam-2026",
    nazev: "Vzdělávání zaměstnanců v malých podnicích",
    zdroj: "ESF+ / MPSV",
    oblast: ["Vzdělávání"],
    alokace: "800 mil. Kč",
    deadline: "2026-04-30",
    popis:
      "Program na zvyšování kvalifikace a dovedností zaměstnanců v malých a středních podnicích. Podporovány jsou kurzy digitálních dovedností, jazykové vzdělávání, odborné a manažerské kurzy, e-learning a mentoring. Zvýhodněny jsou podniky ze zemědělství, potravinářství a cestovního ruchu.",
    relevance: 55,
    status: "open",
    url: "https://www.esfcr.cz/vyzvy/vzdelavani-zamestnancu-msp-2026",
    datumVyhlaseni: "2026-01-10",
    minCastka: "200 tis. Kč",
    maxCastka: "3 mil. Kč",
    miraSpolufinancovani: "85 %",
    typZadatele: ["MSP", "Zemědělec", "OSVČ"],
    cisloVyzvy: "ESF-ZAM-2026-03",
    kolo: "průběžné",
    podminkyUrl: "https://www.esfcr.cz/vyzvy/vzdelavani-zamestnancu-msp-2026/vyzva",
  },
  {
    id: "interreg-czpl-agroturistika-2026",
    nazev: "Přeshraniční agroturistika CZ–PL",
    zdroj: "INTERREG CZ-PL",
    oblast: ["Cestovní ruch", "Zemědělství"],
    alokace: "120 mil. Kč",
    deadline: "2026-06-15",
    popis:
      "Přeshraniční výzva programu INTERREG VI-A Česká republika – Polsko zaměřená na rozvoj společných agroturistických produktů v pohraničí. Podporovány jsou společné marketingové kampaně, turistické balíčky, značení tras a vybavení agroareálů. Projekt musí mít partnery na obou stranách hranice.",
    relevance: 70,
    status: "open",
    url: "https://www.cz-pl.eu/vyzvy/agroturistika-2026",
    datumVyhlaseni: "2026-02-28",
    minCastka: "200 tis. Kč",
    maxCastka: "4 mil. Kč",
    miraSpolufinancovani: "80 %",
    typZadatele: ["Obec", "MSP", "Nezisková org."],
    cisloVyzvy: "INTERREG-CZ-PL-2026-AT-3",
    kolo: "1. kolo",
    podminkyUrl: "https://www.cz-pl.eu/vyzvy/agroturistika-2026/podminky",
  },
  {
    id: "lk-podpora-farmarstvi-2026",
    nazev: "Podpora malého farmářství – Liberecký kraj",
    zdroj: "Liberecký kraj",
    oblast: ["Zemědělství", "Lokální potraviny"],
    alokace: "15 mil. Kč",
    deadline: "2026-04-01",
    popis:
      "Krajský dotační program Libereckého kraje zaměřený na podporu malých rodinných farem a farmářských trhů. Podporovány jsou investice do výrobních zařízení, chladicích kapacit, balicích linek a prezentace na farmářských trzích. Bonifikace za certifikaci BIO nebo regionální značku.",
    relevance: 73,
    status: "closing",
    url: "https://www.kraj-lbc.cz/dotace/farmarstvi-2026",
    datumVyhlaseni: "2026-01-05",
    minCastka: "50 tis. Kč",
    maxCastka: "600 tis. Kč",
    miraSpolufinancovani: "60 %",
    typZadatele: ["Zemědělec", "OSVČ", "MSP"],
    cisloVyzvy: "LK-ZEM-2026-1",
    kolo: "1. kolo",
    podminkyUrl: "https://www.kraj-lbc.cz/dotace/farmarstvi-2026/zasady",
  },
  {
    id: "pak-venkov-cestovni-ruch-2026",
    nazev: "Venkovský cestovní ruch – Pardubický kraj",
    zdroj: "Pardubický kraj",
    oblast: ["Cestovní ruch", "Ubytování"],
    alokace: "20 mil. Kč",
    deadline: "2026-05-15",
    popis:
      "Dotační program Pardubického kraje na rozvoj venkovského a agrárního cestovního ruchu. Podporovány jsou investice do ubytovacích kapacit, stravovacích zařízení s lokálními produkty, sportovního a rekreačního zázemí a pořízení přepravních prostředků pro turisty (koče, kola, lodě).",
    relevance: 61,
    status: "open",
    url: "https://www.pardubickykraj.cz/dotace/venkov-cr-2026",
    datumVyhlaseni: "2026-02-10",
    minCastka: "100 tis. Kč",
    maxCastka: "2 mil. Kč",
    miraSpolufinancovani: "65 %",
    typZadatele: ["MSP", "OSVČ", "Nezisková org."],
    cisloVyzvy: "PAK-CR-2026-2",
    kolo: "průběžné",
    podminkyUrl: "https://www.pardubickykraj.cz/dotace/venkov-cr-2026/zasady",
  },
  {
    id: "mas-orlicko-zemedelstvi-2026",
    nazev: "Zemědělství a zpracování produkce – MAS Orlicko",
    zdroj: "MAS Orlicko",
    oblast: ["Zemědělství", "Zpracování produkce"],
    alokace: "18 mil. Kč",
    deadline: "2026-03-20",
    popis:
      "Výzva Místní akční skupiny Orlicko pro zemědělce a zpracovatele potravin na území MAS. Podporovány jsou investice do zemědělské techniky, zpracovatelských technologií, skladovacích prostor a infrastruktury pro přímý prodej. Preferovány jsou projekty s přidanou hodnotou pro místní komunitu.",
    relevance: 69,
    status: "closing",
    url: "https://mas-orlicko.cz/vyzvy/zemedelstvi-2026",
    datumVyhlaseni: "2025-12-10",
    minCastka: "100 tis. Kč",
    maxCastka: "2 mil. Kč",
    miraSpolufinancovani: "65 %",
    typZadatele: ["Zemědělec", "OSVČ", "MSP"],
    cisloVyzvy: "MAS-ORL-ZEM-2026-6",
    kolo: "2. kolo",
    podminkyUrl: "https://mas-orlicko.cz/vyzvy/zemedelstvi-2026/fiche",
  },
  {
    id: "mas-posazavi-mikroregiony-2026",
    nazev: "Rozvoj mikroregionů a venkovská ekonomika – MAS Posázaví",
    zdroj: "MAS Posázaví",
    oblast: ["Cestovní ruch", "Lokální potraviny"],
    alokace: "10 mil. Kč",
    deadline: "2026-06-01",
    popis:
      "Výzva MAS Posázaví podporující vznik a rozvoj malých podnikatelských záměrů na venkově. Dotace jsou určeny na nové nebo inovované produkty a služby v oblasti cestovního ruchu, lokálního zpracování potravin a kreativních odvětví. Podmínkou je realizace projektu v území MAS.",
    relevance: 52,
    status: "open",
    url: "https://www.mas-posazavi.cz/vyzvy/2026/rozvoj-mikroregionu",
    datumVyhlaseni: "2026-02-15",
    minCastka: "50 tis. Kč",
    maxCastka: "500 tis. Kč",
    miraSpolufinancovani: "70 %",
    typZadatele: ["MSP", "OSVČ", "Fyzická osoba"],
    cisloVyzvy: "MAS-POZ-2026-4",
    kolo: "průběžné",
    podminkyUrl: "https://www.mas-posazavi.cz/vyzvy/2026/rozvoj-mikroregionu/fiche",
  },
  {
    id: "sfzp-stromy-biodiverzita-2026",
    nazev: "Výsadba stromů a posílení biodiverzity",
    zdroj: "SFŽP",
    oblast: ["Životní prostředí", "Zemědělství"],
    alokace: "200 mil. Kč",
    deadline: "2026-09-30",
    popis:
      "Program na zvyšování podílu dřevin v zemědělské krajině a posilování biodiverzity. Podporovány jsou výsadby alejí, remízků, mezí a liniových výsadeb stromů a keřů podél vodních toků, polí a komunikací. Žadateli mohou být obce, zemědělci i soukromé osoby vlastnící pozemky.",
    relevance: 57,
    status: "open",
    url: "https://www.sfzp.cz/dotace/stromy-biodiverzita-2026",
    datumVyhlaseni: "2026-03-20",
    minCastka: "50 tis. Kč",
    maxCastka: "5 mil. Kč",
    miraSpolufinancovani: "100 %",
    typZadatele: ["Obec", "Zemědělec", "Fyzická osoba"],
    cisloVyzvy: "2/2026/BIODIV",
    kolo: "průběžné",
    podminkyUrl: "https://www.sfzp.cz/dotace/stromy-biodiverzita-2026/podmínky",
  },
];

// ─── Helper funkce ──────────────────────────────────────────────────────────

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

/** Souhrnné statistiky pro dashboard */
export function getStats() {
  const aktivni = vyzvy.filter((v) => v.status === "open" || v.status === "closing").length;
  const brzyDeadline = vyzvy.filter(
    (v) => daysUntilDeadline(v.deadline) >= 0 && daysUntilDeadline(v.deadline) <= 14
  ).length;
  const pocetZdroju = new Set(vyzvy.map((v) => v.zdroj)).size;
  const avgRelevance = Math.round(
    vyzvy.reduce((sum, v) => sum + v.relevance, 0) / vyzvy.length
  );
  return { aktivni, brzyDeadline, pocetZdroju, avgRelevance };
}

/** Nejbližší deadliny (seřazeno vzestupně) */
export function getUpcomingDeadlines(n = 4): Vyzva[] {
  return [...vyzvy]
    .filter((v) => daysUntilDeadline(v.deadline) >= 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, n);
}

/** Počet výzev dle oblasti, seřazeno sestupně */
export function getCategoryStats(): Array<{ label: string; value: number }> {
  const map: Record<string, number> = {};
  vyzvy.forEach((v) => v.oblast.forEach((o) => { map[o] = (map[o] || 0) + 1; }));
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));
}

// ─── Statické seznamy ────────────────────────────────────────────────────────

export const statusLabels: Record<string, string> = {
  open: "Otevřená",
  closing: "Končí brzy",
  planned: "Plánovaná",
  closed: "Uzavřená",
};

export const zdrojeList = [
  "SZIF",
  "eAGRI",
  "PRV / eAGRI",
  "SFŽP",
  "OPŽP",
  "AOPK",
  "MAS Krkonoše",
  "MAS Přijďte pobejt",
  "MAS Orlicko",
  "MAS Posázaví",
  "KRNAP",
  "Královéhradecký kraj",
  "Liberecký kraj",
  "Pardubický kraj",
  "MPO",
  "MMR",
  "Modernizační fond",
  "OP TAK / CzechInvest",
  "NPO / MMR",
  "NPO / MZe",
  "IROP",
  "ESF+ / MPSV",
  "INTERREG CZ-PL",
];

export const oblastiList = [
  "Zemědělství",
  "Zpracování produkce",
  "Lokální potraviny",
  "Regionální produkt",
  "Energetika",
  "Bioplyn",
  "Cestovní ruch",
  "Ubytování",
  "Digitalizace",
  "Infrastruktura",
  "Životní prostředí",
  "Vzdělávání",
];
