export interface SeoContentFaq {
  question: string;
  answer: string;
}

export interface ComparisonGuideData {
  slug: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  leftTitle: string;
  rightTitle: string;
  rows: Array<{ label: string; left: string; right: string }>;
  leftPros: string[];
  rightPros: string[];
  conclusion: string;
  faqs: SeoContentFaq[];
  relatedLinks: Array<{ name: string; href: string }>;
}

export const GLOBAL_FAQ_ITEMS: SeoContentFaq[] = [
  {
    question: "Wat kost stucwerk per m² in de Kempen?",
    answer:
      "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk tussen €18 en €28 per m². Renovatie en betonlook zijn maatwerk. Bekijk /kosten-stucwerk voor een volledig overzicht.",
  },
  {
    question: "Werken jullie als stukadoor in Bergeijk en omgeving?",
    answer:
      "Ja, wij werken in ongeveer 30 plaatsen binnen 20 km van Bergeijk, van Hoogeloon en Westerhoven tot Valkenswaard, Lommel en Pelt.",
  },
  {
    question: "Hoe lang moet stucwerk drogen voordat ik kan schilderen?",
    answer:
      "Reken op ongeveer 1 dag droogtijd per millimeter laagdikte. Meer uitleg staat op /stucwerk-droogtijd.",
  },
  {
    question: "Doen jullie ook stucwerk in nieuwbouwwoningen?",
    answer:
      "Ja, wij pleisteren nieuwbouwwoningen strak en sausklaar. Bekijk /stucwerk-nieuwbouw voor meer informatie.",
  },
  {
    question: "Wat is het verschil tussen glad pleisterwerk en schuurwerk?",
    answer:
      "Glad pleisterwerk geeft een vlakke, strakke wand. Schuurwerk heeft een ambachtelijk draaiend patroon op plafonds of wanden. Lees /glad-pleisterwerk-vs-schuurwerk voor een vergelijking.",
  },
  {
    question: "Kunnen jullie betonlook in de badkamer aanbrengen?",
    answer:
      "Ja, betonlook en microcement zijn geschikt voor badkamers, keukens en accentwanden. Dit is maatwerk — wij adviseren graag op locatie.",
  },
  {
    question: "Doen jullie spackspuiten of dunpleister?",
    answer: "Nee, wij doen geen spackspuiten en geen dunpleister. Wij richten ons op glad pleisterwerk, schuurwerk, renovatie en betonlook.",
  },
  {
    question: "Hoe snel krijg ik een offerte?",
    answer:
      "Via de offertecalculator krijgt u direct een richtprijs. Wij reageren meestal binnen één werkdag op aanvragen per telefoon of e-mail.",
  },
  {
    question: "Is advies op locatie gratis?",
    answer:
      "Voor projecten binnen ons werkgebied rond Bergeijk denken wij graag mee. Bij renovatie en betonlook kijken we indien nodig op locatie mee.",
  },
  {
    question: "Wat kost stucwerk in Bergeijk specifiek?",
    answer:
      "De prijs hangt af van oppervlakte, plafonds, hoeken en ondergrond. Bekijk /kosten-stucwerk-bergeijk voor richtprijzen en een calculator.",
  },
  {
    question: "Welke steden bedienen jullie naast Bergeijk?",
    answer:
      "Onder andere Westerhoven, Hoogeloon, Eersel, Luyksgestel, Valkenswaard, Bladel, Reusel, Lommel, Pelt, Leende en Hilvarenbeek.",
  },
  {
    question: "Leveren jullie sausklaar of schilderklaar stucwerk?",
    answer:
      "Ja, afhankelijk van uw wens leveren wij sausklaar, behangklaar of schilderklaar pleisterwerk. Dit bespreken we vooraf in de offerte.",
  },
];

export const COMPARISON_GUIDES: ComparisonGuideData[] = [
  {
    slug: "glad-pleisterwerk-vs-schuurwerk",
    title: "Glad pleisterwerk vs schuurwerk | Wat kiest u?",
    description:
      "Vergelijk glad pleisterwerk en schuurwerk: uitstraling, prijs, toepassing en onderhoud. Advies van Stukadoorsteam De Kempen rond Bergeijk.",
    label: "Stucwerk vergelijken",
    heading: "Glad pleisterwerk vs schuurwerk",
    intro:
      "Twijfelt u tussen glad pleisterwerk en schuurwerk? Beide zijn populaire afwerkingen in woningen rond Bergeijk, maar het effect, de prijs en het onderhoud verschillen duidelijk.",
    leftTitle: "Glad pleisterwerk",
    rightTitle: "Schuurwerk",
    rows: [
      { label: "Uitstraling", left: "Strak, vlak en modern", right: "Ambachtelijk met draaiend patroon" },
      { label: "Richtprijs", left: "€15 – €25 per m²", right: "€18 – €28 per m²" },
      { label: "Ideaal voor", left: "Wanden, plafonds, nieuwbouw", right: "Plafonds en accentwanden" },
      { label: "Schilderen", left: "Zeer geschikt", right: "Minder gebruikelijk" },
      { label: "Onderhoud", left: "Eenvoudig bij vlakke wand", right: "Structuur kan stof vangen" },
    ],
    leftPros: [
      "Strakke, moderne uitstraling",
      "Populair bij nieuwbouw en renovatie",
      "Goed te combineren met schilderwerk",
    ],
    rightPros: [
      "Warme, ambachtelijke look",
      "Minder kans op oneffenheden zichtbaar",
      "Sterk effect op plafonds",
    ],
    conclusion:
      "Kiest u een strakke, moderne basis? Dan past glad pleisterwerk vaak het best. Wilt u karakter op het plafond? Dan is schuurwerk een sterke keuze. Wij denken graag mee op locatie in Bergeijk en omgeving.",
    faqs: [
      {
        question: "Is schuurwerk duurder dan glad pleisterwerk?",
        answer: "Ja, schuurwerk kost meestal iets meer per m² vanwege het ambachtelijke werk.",
      },
      {
        question: "Kan ik schuurwerk op alle plafonds?",
        answer: "In de meeste woningen wel. Wij beoordelen op locatie of de ondergrond en hoogte geschikt zijn.",
      },
    ],
    relatedLinks: [
      { name: "Glad pleisterwerk", href: "/glad-pleisterwerk" },
      { name: "Schuurwerk plafond", href: "/schuurwerk-plafond" },
      { name: "Kosten stucwerk", href: "/kosten-stucwerk" },
      { name: "Stukadoor Bergeijk", href: "/stukadoor-bergeijk" },
    ],
  },
  {
    slug: "stucwerk-nieuwbouw-vs-renovatie",
    title: "Stucwerk nieuwbouw vs renovatie | Verschil uitgelegd",
    description:
      "Wat is het verschil tussen stucwerk in nieuwbouw en renovatie? Ondergrond, prijs en aanpak uitgelegd door stukadoors rond Bergeijk.",
    label: "Nieuwbouw vs renovatie",
    heading: "Stucwerk nieuwbouw vs renovatie",
    intro:
      "Nieuwbouw en renovatie vragen om een andere aanpak. In nieuwbouw is de ondergrond vaak voorspelbaar; bij renovatie spelen scheuren, oude lagen en oneffenheden een rol.",
    leftTitle: "Stucwerk nieuwbouw",
    rightTitle: "Renovatiestucwerk",
    rows: [
      { label: "Ondergrond", left: "Nieuwe wanden, meestal egaal", right: "Bestaande wanden, vaak herstel nodig" },
      { label: "Richtprijs", left: "€15 – €25 per m²", right: "Afhankelijk van herstelwerk" },
      { label: "Planning", left: "Vaak in bouwfase", right: "Tijdens verbouwing" },
      { label: "Droogtijd", left: "Voorspelbaar", right: "Kan langer door herstel" },
      { label: "Resultaat", left: "Sausklaar voor schilder", right: "Wanden weer strak en vlak" },
    ],
    leftPros: [
      "Efficiënt in grotere oppervlaktes",
      "Strakke basis voor afwerking",
      "Duidelijke planning met aannemer",
    ],
    rightPros: [
      "Herstelt beschadigde wanden",
      "Maakt oude muren weer vlak",
      "Ideaal bij verbouwing",
    ],
    conclusion:
      "Bij nieuwbouw draait het om strak en efficiënt pleisteren. Bij renovatie beoordelen we eerst wat er hersteld moet worden. In beide gevallen werken wij rond Bergeijk met duidelijke afspraken vooraf.",
    faqs: [
      {
        question: "Is renovatiestucwerk altijd duurder?",
        answer: "Niet per se, maar extra herstelwerk aan scheuren of oude lagen kan de prijs verhogen.",
      },
      {
        question: "Doen jullie ook nieuwbouw in Hoogeloon en Westerhoven?",
        answer: "Ja, wij werken in nieuwbouwprojecten in de hele regio rond Bergeijk.",
      },
    ],
    relatedLinks: [
      { name: "Stucwerk nieuwbouw", href: "/stucwerk-nieuwbouw" },
      { name: "Renovatiestucwerk", href: "/renovatiestucwerk" },
      { name: "Kosten stucwerk Bergeijk", href: "/kosten-stucwerk-bergeijk" },
      { name: "Veelgestelde vragen", href: "/veelgestelde-vragen" },
    ],
  },
];

export const KOSTEN_STUCWERK_REDIRECTS = [
  "/prijs-stucwerk-per-m2",
  "/wat-kost-stucwerk",
  "/wat-kost-een-stukadoor",
  "/stucwerk-kosten",
];

export const OPENING_HOURS_SPECIFICATION = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "07:30",
    closes: "18:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: "Saturday",
    opens: "08:00",
    closes: "14:00",
  },
];
