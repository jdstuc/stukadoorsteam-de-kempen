export interface CitySeoMeta {
  title: string;
  description: string;
  h1: string;
  heroLabel?: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

const DEFAULT_PRIORITY_CITIES = new Set([
  "Bergeijk",
  "Eersel",
  "Valkenswaard",
  "Bladel",
  "Reusel",
  "Westerhoven",
  "Hoogeloon",
  "Luyksgestel",
]);

export function getCitySeoMeta(city: string, citySlug: string, distanceKm: number): CitySeoMeta | null {
  if (city === "Bergeijk") {
    return {
      title: "Stukadoor Bergeijk | Lokale stukadoors Jeroen, Bram & Kay",
      description:
        "Stukadoor gezocht in Bergeijk? Stukadoorsteam De Kempen levert glad pleisterwerk, schuurwerk, renovatie en betonlook vanuit Bergeijk. Vrijblijvende offerte en richtprijs online.",
      h1: "Stukadoor Bergeijk",
      heroLabel: "Lokale stukadoors uit Bergeijk",
    };
  }

  if (DEFAULT_PRIORITY_CITIES.has(city)) {
    return {
      title: `Stukadoor ${city} | Stukadoorsteam De Kempen – offerte & stucwerk`,
      description: `Stukadoor in ${city} nodig? Lokale stukadoors uit Bergeijk voor glad pleisterwerk, schuurwerk, renovatie en betonlook. ± ${distanceKm} km. Bereken uw richtprijs online.`,
      h1: `Stukadoor ${city}`,
    };
  }

  return null;
}

export function getCityExtraFaqs(city: string, citySlug: string): SeoFaqItem[] {
  const common: SeoFaqItem[] = [
    {
      question: `Hoe snel kan ik een offerte krijgen in ${city}?`,
      answer:
        "Via onze online calculator krijgt u direct een richtprijs. Op aanvragen reageren wij meestal binnen één werkdag.",
    },
    {
      question: `Wat kost stucwerk in ${city}?`,
      answer:
        "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk tussen €18 en €28 per m². Bekijk ook onze pagina kosten stucwerk per plaats.",
    },
  ];

  if (city === "Bergeijk") {
    return [
      {
        question: "Wie is de beste stukadoor in Bergeijk?",
        answer:
          "Wij zijn Jeroen, Bram en Kay: drie lokale stukadoors vanuit Bergeijk met focus op strak pleisterwerk, duidelijke afspraken en nette oplevering. Bekijk onze klantervaringen en vraag vrijblijvend een offerte aan.",
      },
      {
        question: "Stukadoor Bergeijk – wat kost het per m²?",
        answer:
          "Glad pleisterwerk €15–€25/m², schuurwerk €18–€28/m², betonlook vanaf ca. €95/m². Exacte prijs hangt af van oppervlakte en ondergrond.",
      },
      {
        question: "Komen jullie snel langs in Bergeijk?",
        answer:
          "Ja, wij werken vanuit Bergeijk zelf. Voor advies en offertes in Bergeijk en directe omgeving zijn we snel beschikbaar.",
      },
      ...common,
    ];
  }

  return common;
}

export function renderCityCommercialLinks(city: string, citySlug: string): string {
  return `<h2>Offerte en kosten in ${city}</h2>
    <div class="grid">
      <a class="card" href="/offerte-stukadoor-${citySlug}"><strong>Offerte stukadoor ${city}</strong><br />Vrijblijvende richtprijs online</a>
      <a class="card" href="/kosten-stucwerk-${citySlug}"><strong>Kosten stucwerk ${city}</strong><br />Richtprijzen per m²</a>
      <a class="card" href="/stukadoor-gezocht-bergeijk"><strong>Stukadoor gezocht</strong><br />Direct advies rond Bergeijk</a>
      <a class="card" href="/klantervaringen"><strong>Klantervaringen</strong><br />Wat klanten zeggen</a>
    </div>`;
}

export function renderBergeijkTrustSection(): string {
  return `<h2>Stukadoor in Bergeijk – waarom Stukadoorsteam De Kempen?</h2>
    <p>Vanuit Bergeijk werken wij voor woningen, verbouwingen en renovaties in de hele Kempen. U spreekt direct met de vakmannen die het stucwerk uitvoeren — geen callcenter, geen onderaannemers.</p>
    <ul>
      <li><strong>Lokaal:</strong> gevestigd in Bergeijk, korte lijnen in de regio</li>
      <li><strong>Duidelijk:</strong> richtprijs vooraf via calculator, heldere afspraken</li>
      <li><strong>Compleet:</strong> glad pleisterwerk, schuurwerk, renovatie, betonlook en nieuwbouw</li>
      <li><strong>Netjes:</strong> professioneel afplakken en strakke oplevering</li>
    </ul>
    <p><a href="/google-bedrijfsprofiel">Vind ons op Google</a> · <a href="/referentie-nieuwbouw-bergeijk">Referentie Bergeijk</a> · <a href="/jeroen-stukadoor">Ons team</a></p>`;
}

export function getGezochtBergeijkExtraFaqs(): SeoFaqItem[] {
  return [
    {
      question: "Stukadoor gezocht in Bergeijk – hoe snel reactie?",
      answer: "Meestal binnen één werkdag op offerteaanvragen. Voor advies in Bergeijk plannen we snel een afspraak.",
    },
    {
      question: "Wat kost een stukadoor in Bergeijk?",
      answer: "Glad pleisterwerk vaak €15–€25/m². Gebruik onze calculator voor een directe richtprijs op basis van oppervlakte.",
    },
    {
      question: "Doen jullie ook renovatie en nieuwbouw in Bergeijk?",
      answer: "Ja, renovatiestucwerk, wand egaliseren, nieuwbouw en betonlook badkamers behoren tot onze diensten.",
    },
  ];
}
