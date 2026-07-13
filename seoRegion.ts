export interface LocalLandingPageData {
  slug: string;
  city: string;
  intro: string;
  distanceKm: number;
  ring: "centrum" | "dichtbij" | "regio" | "grens";
}

export interface RegionSeoPageData {
  slug: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  priority: string;
}

const CORE_LOCAL_PAGES: LocalLandingPageData[] = [
  { slug: "stukadoor-bergeijk", city: "Bergeijk", distanceKm: 0, ring: "centrum", intro: "Stukadoor nodig in Bergeijk? Jeroen, Bram en Kay leveren strak stucwerk voor woningen, verbouwingen en renovaties in Bergeijk en omliggende dorpen." },
  { slug: "stukadoor-westerhoven", city: "Westerhoven", distanceKm: 5, ring: "dichtbij", intro: "Voor stucwerk in Westerhoven komt Stukadoorsteam De Kempen graag langs voor advies, inmeten en een duidelijke offerte." },
  { slug: "stukadoor-luyksgestel", city: "Luyksgestel", distanceKm: 8, ring: "dichtbij", intro: "In Luyksgestel verzorgen wij glad pleisterwerk, schuurwerk en nette renovatie van wanden en plafonds." },
  { slug: "stukadoor-eersel", city: "Eersel", distanceKm: 10, ring: "dichtbij", intro: "Zoekt u een stukadoor in Eersel? Wij leveren sausklaar pleisterwerk, schuurwerk en betonlook met duidelijke afspraken." },
  { slug: "stukadoor-valkenswaard", city: "Valkenswaard", distanceKm: 14, ring: "regio", intro: "Ook in Valkenswaard helpen wij met professioneel stucwerk, betonlook badkamers en complete wand- en plafondafwerking." },
  { slug: "stukadoor-duizel", city: "Duizel", distanceKm: 9, ring: "dichtbij", intro: "Voor woningen in Duizel bieden wij persoonlijk advies, heldere planning en strak afgewerkt stucwerk." },
  { slug: "stukadoor-hapert", city: "Hapert", distanceKm: 11, ring: "regio", intro: "In Hapert helpen wij met glad pleisterwerk, schuurwerk en renovatiestucwerk voor kleine en grotere projecten." },
  { slug: "stukadoor-steensel", city: "Steensel", distanceKm: 12, ring: "regio", intro: "Voor stucwerk in Steensel werkt u direct met lokale vakmannen die netjes werken en duidelijke afspraken maken." },
  { slug: "stukadoor-lommel", city: "Lommel", distanceKm: 18, ring: "grens", intro: "Net over de grens in Lommel denken wij mee over strak stucwerk, renovatie, pleisterwerk en betonlook afwerking." },
  { slug: "stukadoor-pelt", city: "Pelt", distanceKm: 17, ring: "grens", intro: "Voor Pelt en omgeving bieden wij advies en uitvoering voor glad pleisterwerk, schuurwerk en nette wand- en plafondafwerking." },
  { slug: "stukadoor-riethoven", city: "Riethoven", distanceKm: 13, ring: "regio", intro: "In Riethoven verzorgen wij strak pleisterwerk, herstelwerk en plafonds voor particuliere woningen en renovaties." },
  { slug: "stukadoor-dommelen", city: "Dommelen", distanceKm: 14, ring: "regio", intro: "Voor stucwerk in Dommelen leveren wij duidelijke offertes, nette afwerking en advies over droogtijd en schilderklaar opleveren." },
  { slug: "stukadoor-borkel-en-schaft", city: "Borkel en Schaft", distanceKm: 15, ring: "regio", intro: "Ook in Borkel en Schaft komen wij langs voor glad stucwerk, schuurwerk en renovatie van wanden en plafonds." },
  { slug: "stukadoor-waalre", city: "Waalre", distanceKm: 16, ring: "regio", intro: "Voor woningen in Waalre bieden wij professioneel pleisterwerk, schuurwerk en betonlook met een strakke planning." },
  { slug: "stukadoor-veldhoven", city: "Veldhoven", distanceKm: 19, ring: "regio", intro: "In Veldhoven helpen wij met stucwerk voor nieuwbouw en verbouw, van sausklaar pleisterwerk tot complete plafondafwerking." },
  { slug: "stukadoor-bladel", city: "Bladel", distanceKm: 12, ring: "regio", intro: "In Bladel verzorgen wij glad pleisterwerk, schuurwerk en betonlook voor woningen en verbouwingen." },
  { slug: "stukadoor-reusel", city: "Reusel", distanceKm: 11, ring: "regio", intro: "Voor stucwerk in Reusel kunt u terecht voor advies op locatie, duidelijke offertes en strak afgewerkte wanden." },
];

const EXPANDED_LOCAL_PAGES: LocalLandingPageData[] = [
  { slug: "stukadoor-hoogeloon", city: "Hoogeloon", distanceKm: 6, ring: "dichtbij", intro: "In Hoogeloon, pal naast Bergeijk, helpen wij met glad pleisterwerk, plafonds en renovatiestucwerk voor woningen en verbouwingen." },
  { slug: "stukadoor-gastel", city: "Gastel", distanceKm: 7, ring: "dichtbij", intro: "Voor stucwerk in Gastel en omgeving komen Jeroen, Bram of Kay graag langs voor advies, inmeten en een nette afwerking." },
  { slug: "stukadoor-casteren", city: "Casteren", distanceKm: 9, ring: "dichtbij", intro: "Stukadoor gezocht in Casteren? Wij leveren strak stucwerk, schuurwerk en renovatiepleisterwerk binnen het werkgebied rond Bergeijk." },
  { slug: "stukadoor-knegsel", city: "Knegsel", distanceKm: 11, ring: "regio", intro: "Ook in Knegsel verzorgen wij sausklaar pleisterwerk, plafonds en stucwerk voor nieuwbouw en renovatie." },
  { slug: "stukadoor-wintelre", city: "Wintelre", distanceKm: 12, ring: "regio", intro: "Voor woningen in Wintelre bieden wij persoonlijk advies, heldere offertes en strak afgewerkt stucwerk." },
  { slug: "stukadoor-netersel", city: "Netersel", distanceKm: 13, ring: "regio", intro: "In Netersel helpen wij met glad pleisterwerk, schuurwerk plafonds en herstel van bestaande wanden." },
  { slug: "stukadoor-leende", city: "Leende", distanceKm: 15, ring: "regio", intro: "Zoekt u een stukadoor in Leende? Wij werken net over de provinciegrens met dezelfde korte lijnen en lokale service als in Bergeijk." },
  { slug: "stukadoor-hilvarenbeek", city: "Hilvarenbeek", distanceKm: 16, ring: "regio", intro: "Voor stucwerk in Hilvarenbeek denken wij mee over ondergrond, droogtijd en de juiste afwerking voor uw woning." },
  { slug: "stukadoor-oirschot", city: "Oirschot", distanceKm: 18, ring: "regio", intro: "Ook richting Oirschot komen wij graag langs voor glad pleisterwerk, renovatiestucwerk en betonlook badkamers." },
  { slug: "stukadoor-baarle-nassau", city: "Baarle-Nassau", distanceKm: 14, ring: "regio", intro: "Voor stucwerk in Baarle-Nassau en omgeving leveren wij netjes afgewerkt pleisterwerk met duidelijke afspraken vooraf." },
  { slug: "stukadoor-achel", city: "Achel", distanceKm: 12, ring: "grens", intro: "Net over de Belgische grens in Achel helpen wij met strak stucwerk, renovatie en betonlook voor woningen." },
  { slug: "stukadoor-overpelt", city: "Overpelt", distanceKm: 17, ring: "grens", intro: "Voor stucwerk in Overpelt bieden wij advies op locatie, offertes op maat en nette oplevering van wanden en plafonds." },
  { slug: "stukadoor-neerpelt", city: "Neerpelt", distanceKm: 18, ring: "grens", intro: "Ook in Neerpelt verzorgen wij glad pleisterwerk, schuurwerk en renovatiestucwerk binnen ons werkgebied rond Bergeijk." },
];

export const LOCAL_LANDING_PAGES: LocalLandingPageData[] = [...CORE_LOCAL_PAGES, ...EXPANDED_LOCAL_PAGES];

export const REGION_SEO_PAGES: RegionSeoPageData[] = [
  {
    slug: "stukadoor-rondom-bergeijk",
    title: "Stukadoor rondom Bergeijk | 30 plaatsen binnen 20 km",
    description:
      "Stukadoor gezocht rondom Bergeijk? Bekijk alle plaatsen waar Stukadoorsteam De Kempen actief is: van Westerhoven en Hoogeloon tot Valkenswaard, Lommel en Pelt.",
    label: "Regio Bergeijk",
    heading: "Stukadoor rondom Bergeijk",
    intro:
      "Zoekt u een stukadoor in de buurt van Bergeijk? Wij werken bewust lokaal in ongeveer 30 plaatsen binnen 20 km, van Brabantse dorpen tot grensgemeenten in België. Korte lijnen, snelle afspraken en advies op locatie.",
    priority: "0.98",
  },
  {
    slug: "stukadoor-binnen-20-km-bergeijk",
    title: "Stukadoor binnen 20 km van Bergeijk | Werkgebied overzicht",
    description:
      "Overzicht van alle stukadoor pagina's binnen 20 km van Bergeijk. Glad pleisterwerk, schuurwerk, renovatie en betonlook door Jeroen, Bram en Kay.",
    label: "20 km rond Bergeijk",
    heading: "Stukadoor binnen 20 km van Bergeijk",
    intro:
      "Ons werkgebied strekt zich uit over de Brabantse Kempen en omliggende dorpen. Hieronder vindt u alle plaatsen waar wij als stukadoor langskomen — gesorteerd op afstand tot Bergeijk.",
    priority: "0.97",
  },
  {
    slug: "stucwerk-rondom-bergeijk",
    title: "Stucwerk rondom Bergeijk | Pleisterwerk in de regio",
    description:
      "Stucwerk nodig rondom Bergeijk? Glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook in meer dan 30 plaatsen binnen 20 km.",
    label: "Stucwerk regio",
    heading: "Stucwerk rondom Bergeijk",
    intro:
      "Van nieuwbouw tot renovatie: wij verzorgen stucwerk rondom Bergeijk voor wanden, plafonds en badkamers. Bekijk per plaats wat wij voor u kunnen betekenen.",
    priority: "0.96",
  },
  {
    slug: "stukadoor-regio-bergeijk",
    title: "Stukadoor regio Bergeijk | Kempen en de Peel",
    description:
      "Lokale stukadoor voor de regio Bergeijk, de Kempen en de Peel. Werkgebied met Eersel, Bladel, Reusel, Valkenswaard, Lommel en Pelt.",
    label: "Regio Bergeijk & Kempen",
    heading: "Stukadoor regio Bergeijk",
    intro:
      "Stukadoorsteam De Kempen is uw lokale partner voor stucwerk in de regio Bergeijk, op de grens van Noord-Brabant, Limburg en België. Direct contact met de vakmannen die het werk uitvoeren.",
    priority: "0.96",
  },
  {
    slug: "stukadoor-gezocht-bergeijk",
    title: "Stukadoor gezocht Bergeijk | Vrijblijvende offerte",
    description:
      "Stukadoor gezocht in of rond Bergeijk? Vraag een vrijblijvende offerte aan voor glad pleisterwerk, schuurwerk, renovatie of betonlook.",
    label: "Stukadoor gezocht",
    heading: "Stukadoor gezocht rond Bergeijk?",
    intro:
      "U bent niet de enige die online zoekt naar een betrouwbare stukadoor rond Bergeijk. Jeroen, Bram en Kay helpen u graag verder met advies, een heldere offerte en netjes uitgevoerd stucwerk.",
    priority: "0.95",
  },
  {
    slug: "stucwerk-bergeijk",
    title: "Stucwerk Bergeijk en omgeving | Lokale stukadoors",
    description:
      "Stucwerk in Bergeijk en omliggende dorpen. Sausklaar pleisterwerk, plafonds, renovatie en betonlook door Stukadoorsteam De Kempen.",
    label: "Stucwerk Bergeijk",
    heading: "Stucwerk Bergeijk en omgeving",
    intro:
      "Of het nu gaat om een nieuwbouwwoning in Bergeijk, een verbouwing in Westerhoven of een badkamer in Eersel — wij verzorgen stucwerk in de hele regio rond Bergeijk.",
    priority: "0.95",
  },
];

export const REGION_RING_LABELS: Record<LocalLandingPageData["ring"], string> = {
  centrum: "Bergeijk en directe omgeving",
  dichtbij: "Binnen 10 km van Bergeijk",
  regio: "10–20 km van Bergeijk",
  grens: "Grensgemeenten (België en Limburg)",
};

export function getCitySlug(page: LocalLandingPageData): string {
  return page.slug.replace("stukadoor-", "");
}

export function buildCitySlugMap(): Record<string, string> {
  return Object.fromEntries(LOCAL_LANDING_PAGES.map((page) => [page.city, getCitySlug(page)]));
}

export function buildCitiesSeoText(): string {
  const cities = LOCAL_LANDING_PAGES.map((page) => page.city);
  if (cities.length <= 2) {
    return cities.join(" en ");
  }

  return `${cities.slice(0, -1).join(", ")} en ${cities[cities.length - 1]}`;
}

export function groupPagesByRing(): Record<LocalLandingPageData["ring"], LocalLandingPageData[]> {
  return LOCAL_LANDING_PAGES.reduce(
    (groups, page) => {
      groups[page.ring].push(page);
      return groups;
    },
    {
      centrum: [] as LocalLandingPageData[],
      dichtbij: [] as LocalLandingPageData[],
      regio: [] as LocalLandingPageData[],
      grens: [] as LocalLandingPageData[],
    }
  );
}
