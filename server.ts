import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import type { QuoteRequest } from "./src/types";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.env.VERCEL ? "/tmp" : process.cwd(), "quotes_db.json");

type StoredQuote = QuoteRequest;

interface QuotePayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  city?: unknown;
  plasterType?: unknown;
  area?: unknown;
  description?: unknown;
  estimatedPrice?: unknown;
}

interface ChatHistoryTurn {
  role: "user" | "model";
  content: string;
}

interface ChatPayload {
  message?: unknown;
  history?: unknown;
}

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

app.use(express.json());

// Initialize the GoogleGenAI client on server-side
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Helper to load quotes from local JSON file
function loadQuotes(): StoredQuote[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed: unknown = JSON.parse(data);
      return Array.isArray(parsed) ? parsed.filter(isStoredQuote) : [];
    }
  } catch (error) {
    console.error("Fout bij laden van offertes:", error);
  }
  return [];
}

// Helper to save quotes to local JSON file
function saveQuotes(quotes: StoredQuote[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(quotes, null, 2), "utf-8");
  } catch (error) {
    console.error("Fout bij opslaan van offertes:", error);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(value: unknown, fallback = 0): number {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : Number.NaN;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Onbekende fout";
}

function isStoredQuote(value: unknown): value is StoredQuote {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    typeof value.city === "string" &&
    typeof value.plasterType === "string" &&
    typeof value.area === "number" &&
    typeof value.description === "string" &&
    typeof value.estimatedPrice === "number" &&
    typeof value.status === "string" &&
    typeof value.date === "string"
  );
}

function isChatHistoryTurn(value: unknown): value is ChatHistoryTurn {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value.role === "user" || value.role === "model") &&
    typeof value.content === "string" &&
    value.content.trim().length > 0
  );
}

// Ensure the JSON DB file exists
if (!fs.existsSync(DB_FILE)) {
  saveQuotes([]);
}

const LOCAL_LANDING_PAGES = [
  { slug: "stukadoor-bergeijk", city: "Bergeijk", intro: "Stukadoor nodig in Bergeijk? Jeroen, Bram en Kay leveren strak stucwerk voor woningen, verbouwingen en renovaties in Bergeijk en omliggende dorpen." },
  { slug: "stukadoor-westerhoven", city: "Westerhoven", intro: "Voor stucwerk in Westerhoven komt Stukadoorsteam De Kempen graag langs voor advies, inmeten en een duidelijke richtprijs." },
  { slug: "stukadoor-luyksgestel", city: "Luyksgestel", intro: "In Luyksgestel verzorgen wij glad pleisterwerk, schuurwerk en nette renovatie van wanden en plafonds." },
  { slug: "stukadoor-eersel", city: "Eersel", intro: "Zoekt u een stukadoor in Eersel? Wij leveren sausklaar pleisterwerk, schuurwerk en betonlook met duidelijke afspraken." },
  { slug: "stukadoor-valkenswaard", city: "Valkenswaard", intro: "Ook in Valkenswaard helpen wij met professioneel stucwerk, betonlook badkamers en complete wand- en plafondafwerking." },
  { slug: "stukadoor-duizel", city: "Duizel", intro: "Voor woningen in Duizel bieden wij persoonlijk advies, heldere planning en strak afgewerkt stucwerk zonder onnodige voorrijkosten." },
  { slug: "stukadoor-hapert", city: "Hapert", intro: "In Hapert helpen wij met glad pleisterwerk, schuurwerk en renovatiestucwerk voor kleine en grotere projecten." },
  { slug: "stukadoor-steensel", city: "Steensel", intro: "Voor stucwerk in Steensel werkt u direct met lokale vakmannen die netjes werken en duidelijke afspraken maken." },
  { slug: "stukadoor-lommel", city: "Lommel", intro: "Net over de grens in Lommel denken wij mee over strak stucwerk, renovatie, pleisterwerk en betonlook afwerking." },
  { slug: "stukadoor-pelt", city: "Pelt", intro: "Voor Pelt en omgeving bieden wij advies en uitvoering voor glad pleisterwerk, schuurwerk en nette wand- en plafondafwerking." },
  { slug: "stukadoor-riethoven", city: "Riethoven", intro: "In Riethoven verzorgen wij strak pleisterwerk, herstelwerk en plafonds voor particuliere woningen en renovaties." },
  { slug: "stukadoor-dommelen", city: "Dommelen", intro: "Voor stucwerk in Dommelen leveren wij duidelijke offertes, nette afwerking en advies over droogtijd en schilderklaar opleveren." },
  { slug: "stukadoor-borkel-en-schaft", city: "Borkel en Schaft", intro: "Ook in Borkel en Schaft komen wij langs voor glad stucwerk, schuurwerk en renovatie van wanden en plafonds." },
  { slug: "stukadoor-waalre", city: "Waalre", intro: "Voor woningen in Waalre bieden wij professioneel pleisterwerk, schuurwerk en betonlook met een strakke planning." },
  { slug: "stukadoor-veldhoven", city: "Veldhoven", intro: "In Veldhoven helpen wij met stucwerk voor nieuwbouw en verbouw, van sausklaar pleisterwerk tot complete plafondafwerking." },
  { slug: "stukadoor-bladel", city: "Bladel", intro: "In Bladel verzorgen wij glad pleisterwerk, schuurwerk en betonlook voor woningen en verbouwingen." },
  { slug: "stukadoor-reusel", city: "Reusel", intro: "Voor stucwerk in Reusel kunt u terecht voor advies op locatie, duidelijke prijzen en strak afgewerkte wanden." },
];

const SERVICE_LANDING_PAGES = [
  {
    slug: "glad-pleisterwerk",
    name: "Glad pleisterwerk",
    intro: "Glad pleisterwerk zorgt voor strakke wanden en plafonds die klaar zijn om te schilderen of te behangen.",
    price: "Richtprijs: €15 - €25 per m²",
  },
  {
    slug: "schuurwerk-plafond",
    name: "Schuurwerk plafond",
    intro: "Schuurwerk geeft plafonds en wanden een ambachtelijke structuur met een klassiek draaiend patroon.",
    price: "Richtprijs: €18 - €28 per m²",
  },
  {
    slug: "renovatiestucwerk",
    name: "Renovatiestucwerk",
    intro: "Renovatiestucwerk maakt beschadigde, ongelijke of oude wanden weer strak en klaar voor schilderwerk.",
    price: "Richtprijs afhankelijk van ondergrond en herstelwerk",
  },
  {
    slug: "betonlook-badkamer",
    name: "Betonlook badkamer",
    intro: "Betonlook en microcement geven badkamers, keukens en accentwanden een luxe, naadloze uitstraling.",
    price: "Richtprijs: €95 - €140 per m²",
  },
];

const BASE_URL = "https://www.stukadoorsteamdekempen.nl";
const LOGO_URL = `${BASE_URL}/logo-stukadoorsteam-de-kempen.png`;

const COMBO_SERVICE_PAGES = SERVICE_LANDING_PAGES;
const COMBO_LOCATION_PAGES = LOCAL_LANDING_PAGES;

const COMBO_LANDING_PAGES = COMBO_LOCATION_PAGES.flatMap((location) =>
  COMBO_SERVICE_PAGES.map((service) => ({
    slug: `${service.slug}-${location.slug.replace("stukadoor-", "")}`,
    city: location.city,
    serviceName: service.name,
    serviceSlug: service.slug,
    serviceIntro: service.intro,
    price: service.price,
  }))
);

const DEPRECATED_SERVICE_PATHS = [
  "/dunpleister-nieuwbouw",
  "/spackspuiten",
  ...LOCAL_LANDING_PAGES.map((page) => `/${"dunpleister-nieuwbouw"}-${page.slug.replace("stukadoor-", "")}`),
  ...LOCAL_LANDING_PAGES.map((page) => `/${"spackspuiten"}-${page.slug.replace("stukadoor-", "")}`),
];

for (const deprecatedPath of DEPRECATED_SERVICE_PATHS) {
  app.get(deprecatedPath, (_req, res) => {
    res
      .status(410)
      .set("X-Robots-Tag", "noindex, nofollow")
      .type("html")
      .send("<!doctype html><html lang=\"nl\"><head><title>Dienst niet beschikbaar</title><meta name=\"robots\" content=\"noindex,nofollow\"></head><body><h1>Dienst niet beschikbaar</h1><p>Deze dienst wordt niet aangeboden door Stukadoorsteam De Kempen.</p><p><a href=\"/\">Terug naar de homepage</a></p></body></html>");
  });
}

for (const page of LOCAL_LANDING_PAGES) {
  const citySlug = page.slug.replace("stukadoor-", "");
  app.get(`/stucadoor-${citySlug}`, (_req, res) => {
    res.redirect(301, `/${page.slug}`);
  });
}

app.get(["/stukadoor-begeijk", "/stucadoor-begeijk"], (_req, res) => {
  res.redirect(301, "/stukadoor-bergeijk");
});

app.use((req, res, next) => {
  const host = (req.get("host") || "").split(":")[0].toLowerCase();
  if (host === "stukadoorsteamdekempen.nl") {
    return res.redirect(301, `https://www.stukadoorsteamdekempen.nl${req.originalUrl}`);
  }

  next();
});

app.use((req, res, next) => {
  if (req.path === "/" || req.path.includes(".")) {
    return next();
  }

  const canonicalPath = req.path.replace(/\/+$/, "").toLowerCase();
  if (canonicalPath !== req.path) {
    return res.redirect(301, `${canonicalPath}${req.url.slice(req.path.length)}`);
  }

  next();
});

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

interface SeoLink {
  name: string;
  href: string;
}

interface SeoFaq {
  question: string;
  answer: string;
}

function renderWebPageJsonLd(title: string, description: string, url: string): string {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    image: LOGO_URL,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: LOGO_URL,
      caption: "Logo Stukadoorsteam De Kempen",
    },
    inLanguage: "nl-NL",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      name: "Stukadoorsteam De Kempen",
      url: BASE_URL,
    },
    about: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Stukadoorsteam De Kempen",
      url: BASE_URL,
      logo: LOGO_URL,
      image: LOGO_URL,
      telephone: "+31 497 123 456",
      email: "info@stukadoorsteamdekempen.nl",
      areaServed: ["Bergeijk", "Eersel", "Valkenswaard", "Luyksgestel", "Westerhoven", "Hapert", "Steensel", "Lommel", "Pelt"],
    },
  })}</script>`;
}

function renderAlternateLinks(url: string): string {
  return `<link rel="alternate" hreflang="nl-NL" href="${url}" />
    <link rel="alternate" hreflang="x-default" href="${url}" />`;
}

function renderSocialImageMeta(title?: string, description?: string): string {
  const safeTitle = title ? escapeHtml(title) : "Stukadoorsteam De Kempen";
  const safeDescription = description
    ? escapeHtml(description)
    : "Lokale stukadoors voor glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook in de Kempen.";

  return `<meta property="og:image" content="${LOGO_URL}" />
    <meta property="og:image:alt" content="Logo Stukadoorsteam De Kempen - vakwerk door teamwork" />
    <meta property="og:site_name" content="Stukadoorsteam De Kempen" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${LOGO_URL}" />`;
}

function renderSeoAssets(): string {
  return `<link rel="stylesheet" href="/seo-pages.css" />`;
}

function renderSeoSiteHeader(): string {
  return `<header class="seo-header">
    <a class="seo-logo" href="/"><img src="/logo-stukadoorsteam-de-kempen.png" alt="Stukadoorsteam De Kempen" width="180" height="48" loading="eager" /></a>
    <nav class="seo-nav" aria-label="Hoofdnavigatie">
      <a href="/stukadoor-kempen">Kempen</a>
      <a href="/werkgebied">Werkgebied</a>
      <a href="/diensten">Diensten</a>
      <a href="/stukadoor-prijzen">Prijzen</a>
      <a href="/contact-stukadoor">Contact</a>
    </nav>
  </header>`;
}

function renderSeoFooterNav(): string {
  return `<nav class="seo-footer" aria-label="Gerelateerde pagina's">
        <p>
          <a href="/stukadoor-kempen">Stukadoor Kempen</a> ·
          <a href="/werkgebied">Werkgebied</a> ·
          <a href="/diensten">Diensten</a> ·
          <a href="/stukadoor-prijzen">Prijzen</a> ·
          <a href="/contact-stukadoor">Contact</a> ·
          <a href="/over-ons">Over ons</a> ·
          <a href="/stucwerk-droogtijd">Droogtijd</a> ·
          <a href="/site-overzicht">Site-overzicht</a> ·
          <a href="/">Home</a>
        </p>
      </nav>`;
}

function renderBreadcrumbNav(items: SeoLink[]): string {
  return `<nav class="breadcrumb" aria-label="Breadcrumb">${items
    .map((item, index) => {
      const separator = index > 0 ? '<span aria-hidden="true">/</span>' : "";
      return `${separator}<a href="${escapeHtml(item.href)}">${escapeHtml(item.name)}</a>`;
    })
    .join("")}</nav>`;
}

function renderBreadcrumbJsonLd(items: SeoLink[]): string {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  })}</script>`;
}

function renderFaqJsonLd(faqs: SeoFaq[]): string {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  })}</script>`;
}

function renderFaqCards(faqs: SeoFaq[]): string {
  return faqs
    .map(
      (faq) =>
        `<article class="card"><strong>${escapeHtml(faq.question)}</strong><br />${escapeHtml(faq.answer)}</article>`
    )
    .join("");
}

function getNearbyCityPages(currentCity: string): typeof LOCAL_LANDING_PAGES {
  const currentIndex = LOCAL_LANDING_PAGES.findIndex((page) => page.city === currentCity);
  if (currentIndex === -1) {
    return [];
  }

  const nearby: typeof LOCAL_LANDING_PAGES = [];
  for (let offset = 1; offset <= 4; offset += 1) {
    nearby.push(LOCAL_LANDING_PAGES[(currentIndex + offset) % LOCAL_LANDING_PAGES.length]);
  }
  return nearby;
}

function renderLocalPlaceJsonLd(page: typeof LOCAL_LANDING_PAGES[number], url: string): string {
  const citySlug = page.slug.replace("stukadoor-", "");
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness-place`,
    name: `Stukadoorsteam De Kempen - ${page.city}`,
    url,
    image: LOGO_URL,
    logo: LOGO_URL,
    telephone: "+31 497 123 456",
    email: "info@stukadoorsteamdekempen.nl",
    parentOrganization: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Stukadoorsteam De Kempen",
    },
    areaServed: {
      "@type": "Place",
      name: page.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: page.city,
        addressRegion: "Noord-Brabant",
        addressCountry: "NL",
      },
    },
    makesOffer: SERVICE_LANDING_PAGES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${service.name} ${page.city}`,
        url: `${BASE_URL}/${service.slug}-${citySlug}`,
      },
    })),
  })}</script>`;
}

function renderOfferCatalogJsonLd(): string {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Stukadoor prijzen Stukadoorsteam De Kempen",
    url: `${BASE_URL}/stukadoor-prijzen`,
    itemListElement: SERVICE_LANDING_PAGES.map((page, index) => ({
      "@type": "Offer",
      position: index + 1,
      itemOffered: {
        "@type": "Service",
        name: page.name,
        url: `${BASE_URL}/${page.slug}`,
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "EUR",
        description: page.price,
      },
    })),
  })}</script>`;
}

function renderNearbyCityLinks(currentCity: string): string {
  return getNearbyCityPages(currentCity)
    .map((page) => `<a href="/${page.slug}">Stukadoor ${escapeHtml(page.city)}</a>`)
    .join(" · ");
}

function renderLocalLandingPage(page: typeof LOCAL_LANDING_PAGES[number]) {
  const city = escapeHtml(page.city);
  const intro = escapeHtml(page.intro);
  const citySlug = page.slug.replace("stukadoor-", "");
  const url = `${BASE_URL}/${page.slug}`;
  const title = `Stukadoor ${city} | Pleisterwerk, schuurwerk en betonlook`;
  const description = `Stukadoor in ${city} nodig? Stukadoorsteam De Kempen helpt met glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook binnen 20 km van Bergeijk.`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Werkgebied", href: "/werkgebied" },
    { name: `Stukadoor ${page.city}`, href: `/${page.slug}` },
  ];
  const faqs = [
    {
      question: `Werken jullie als stukadoor in ${page.city}?`,
      answer: `Ja, Stukadoorsteam De Kempen werkt in ${page.city} en omliggende plaatsen binnen ongeveer 20 km van Bergeijk.`,
    },
    {
      question: `Welke soorten stucwerk doen jullie in ${page.city}?`,
      answer: "Wij helpen met glad pleisterwerk, schuurwerk, renovatiestucwerk, betonlook en microcement.",
    },
    {
      question: `Kan ik een richtprijs krijgen voor stucwerk in ${page.city}?`,
      answer: "Ja, via de offertecalculator krijgt u snel een indicatie. Bekijk ook onze richtprijzen per dienst.",
    },
    {
      question: `Hoe lang moet stucwerk drogen in ${page.city}?`,
      answer: "Reken op ongeveer 1 dag droogtijd per millimeter laagdikte. Meer uitleg staat op onze pagina over stucwerk droogtijd.",
    },
  ];

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Stukadoor ${city}",
        "serviceType": "Stucwerk, glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.stukadoorsteamdekempen.nl/#localbusiness",
          "name": "Stukadoorsteam De Kempen",
          "url": "https://www.stukadoorsteamdekempen.nl/",
          "telephone": "+31 497 123 456",
          "email": "info@stukadoorsteamdekempen.nl"
        },
        "areaServed": { "@type": "Place", "name": "${city}" }
      }
    </script>
    ${renderLocalPlaceJsonLd(page, url)}
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,78px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Stukadoor binnen 20 km van Bergeijk</div>
        <h1>Stukadoor ${city}</h1>
        <p>${intro}</p>
        <a class="cta" href="/?tab=calculator">Vrijblijvende offerte berekenen</a>
      </section>
      <section>
        <h2>Stucwerk in ${city}: strak, duidelijk en lokaal</h2>
        <p>Stukadoorsteam De Kempen bestaat uit Jeroen, Bram en Kay. Wij werken voor particuliere woningen en renovaties in ${city} en de regio rond Bergeijk. U kunt bij ons terecht voor glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook.</p>
        <div class="grid">
          <article class="card"><strong>Glad pleisterwerk</strong><br />Strakke wanden en plafonds, sausklaar of behangklaar afgewerkt.<br /><a href="/glad-pleisterwerk-${citySlug}">Glad pleisterwerk in ${city}</a></article>
          <article class="card"><strong>Schuurwerk plafond</strong><br />Ambachtelijke plafondafwerking met een klassiek draaiend patroon.<br /><a href="/schuurwerk-plafond-${citySlug}">Schuurwerk in ${city}</a></article>
          <article class="card"><strong>Renovatiestucwerk</strong><br />Oude of beschadigde wanden weer strak, vlak en klaar voor schilderwerk.<br /><a href="/renovatiestucwerk-${citySlug}">Renovatiestucwerk in ${city}</a></article>
          <article class="card"><strong>Betonlook</strong><br />Luxe naadloze afwerking voor badkamer, keuken of accentwand.<br /><a href="/betonlook-badkamer-${citySlug}">Betonlook in ${city}</a></article>
        </div>
        <h2>Waarom kiezen voor Stukadoorsteam De Kempen?</h2>
        <p>U hebt direct contact met de vakmannen die het werk uitvoeren. We denken mee over voorbereiding, droogtijd, planning en de beste afwerking voor uw woning in ${city}. Vraag online een richtprijs aan of neem contact op voor advies op locatie.</p>
        <h2>Veelgestelde vragen over stucwerk in ${city}</h2>
        <div class="grid">
          ${renderFaqCards(faqs)}
        </div>
        <p><a href="/stukadoor-prijzen">Richtprijzen stucwerk</a> · <a href="/contact-stukadoor">Contact opnemen</a> · <a href="/stucwerk-droogtijd">Droogtijd stucwerk</a> · <a href="/diensten">Alle diensten</a></p>
        <h2>Stukadoor in de buurt van ${city}</h2>
        <p>${renderNearbyCityLinks(page.city)}</p>
        <p><a href="/werkgebied">Alle stukadoor pagina's in werkgebied</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

for (const page of LOCAL_LANDING_PAGES) {
  app.get(`/${page.slug}`, (_req, res) => {
    res.type("html").send(renderLocalLandingPage(page));
  });
}

function renderServiceLandingPage(page: typeof SERVICE_LANDING_PAGES[number]) {
  const serviceName = escapeHtml(page.name);
  const intro = escapeHtml(page.intro);
  const price = escapeHtml(page.price);
  const url = `${BASE_URL}/${page.slug}`;
  const title = `${serviceName} | Stukadoorsteam De Kempen`;
  const description = `${serviceName} door Stukadoorsteam De Kempen binnen 20 km van Bergeijk. ${intro} ${price}.`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Diensten", href: "/diensten" },
    { name: page.name, href: `/${page.slug}` },
  ];
  const faqs = [
    {
      question: `Wat kost ${page.name.toLowerCase()}?`,
      answer: `${page.price}. De exacte prijs hangt af van oppervlakte, ondergrond, hoeken, plafonds en voorbereiding.`,
    },
    {
      question: `Waar voeren jullie ${page.name.toLowerCase()} uit?`,
      answer: "Wij werken vooral binnen ongeveer 20 km van Bergeijk, waaronder Eersel, Valkenswaard, Luyksgestel, Westerhoven, Hapert, Steensel, Lommel en Pelt.",
    },
    {
      question: `Kan ik advies krijgen over ${page.name.toLowerCase()}?`,
      answer: "Ja, Jeroen, Bram of Kay denkt graag mee over de juiste afwerking, droogtijd en voorbereiding.",
    },
  ];
  const serviceCityLinks = LOCAL_LANDING_PAGES.map((localPage) => {
      const citySlug = localPage.slug.replace("stukadoor-", "");
      return `<a class="card" href="/${page.slug}-${citySlug}"><strong>${serviceName} ${escapeHtml(localPage.city)}</strong><br />Meer informatie over ${serviceName.toLowerCase()} in ${escapeHtml(localPage.city)}.</a>`;
    })
    .join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${serviceName}",
        "description": "${description}",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.stukadoorsteamdekempen.nl/#localbusiness",
          "name": "Stukadoorsteam De Kempen",
          "url": "https://www.stukadoorsteamdekempen.nl/",
          "telephone": "+31 497 123 456",
          "email": "info@stukadoorsteamdekempen.nl"
        },
        "areaServed": [
          "Bergeijk",
          "Westerhoven",
          "Luyksgestel",
          "Eersel",
          "Valkenswaard",
          "Lommel",
          "Pelt",
          "Bladel",
          "Reusel"
        ],
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "description": "${price}"
        }
      }
    </script>
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,78px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Stucwerk binnen 20 km van Bergeijk</div>
        <h1>${serviceName}</h1>
        <p>${intro}</p>
        <p><strong>${price}</strong></p>
        <a class="cta" href="/?tab=calculator">Bereken uw richtprijs</a>
      </section>
      <section>
        <h2>${serviceName} in Bergeijk, Eersel, Valkenswaard, Lommel en Pelt</h2>
        <p>Stukadoorsteam De Kempen voert ${serviceName.toLowerCase()} uit voor woningen binnen ongeveer 20 km van Bergeijk. We werken onder andere in Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Bladel en Reusel.</p>
        <div class="grid">
          ${serviceCityLinks}
        </div>
        <h2>Waarom kiezen voor ${serviceName.toLowerCase()}?</h2>
        <div class="grid">
          <article class="card"><strong>Duidelijke prijs</strong><br />U krijgt vooraf een heldere richtprijs op basis van oppervlakte en afwerking.</article>
          <article class="card"><strong>Lokale vakmannen</strong><br />Jeroen, Bram en Kay denken zelf mee en voeren het werk netjes uit.</article>
          <article class="card"><strong>Nette oplevering</strong><br />We letten op afplakken, droogtijd en een strakke afwerking.</article>
        </div>
        <h2>Offerte voor ${serviceName}</h2>
        <p>Wilt u weten wat ${serviceName.toLowerCase()} voor uw woning kost? Gebruik de offertecalculator of neem contact op voor advies op locatie.</p>
        <h2>Veelgestelde vragen over ${serviceName.toLowerCase()}</h2>
        <div class="grid">
          ${renderFaqCards(faqs)}
        </div>
        <p><a href="/diensten">Alle stucwerk diensten</a> · <a href="/stukadoor-prijzen">Richtprijzen</a> · <a href="/werkgebied">Werkgebied</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

for (const page of SERVICE_LANDING_PAGES) {
  app.get(`/${page.slug}`, (_req, res) => {
    res.type("html").send(renderServiceLandingPage(page));
  });
}

function renderComboLandingPage(page: typeof COMBO_LANDING_PAGES[number]) {
  const city = escapeHtml(page.city);
  const serviceName = escapeHtml(page.serviceName);
  const serviceIntro = escapeHtml(page.serviceIntro);
  const price = escapeHtml(page.price);
  const url = `${BASE_URL}/${page.slug}`;
  const title = `${serviceName} ${city} | Stukadoorsteam De Kempen`;
  const description = `${serviceName} in ${city} nodig? Stukadoorsteam De Kempen helpt met strak stucwerk binnen 20 km van Bergeijk. ${price}.`;
  const citySlug = page.slug.split("-").slice(page.serviceSlug.split("-").length).join("-");
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Werkgebied", href: "/werkgebied" },
    { name: `Stukadoor ${page.city}`, href: `/stukadoor-${citySlug}` },
    { name: page.serviceName, href: `/${page.serviceSlug}` },
    { name: `${page.serviceName} ${page.city}`, href: `/${page.slug}` },
  ];
  const faqs = [
    {
      question: `Doen jullie ${page.serviceName.toLowerCase()} in ${page.city}?`,
      answer: `Ja, wij voeren ${page.serviceName.toLowerCase()} uit in ${page.city} en omliggende plaatsen binnen ongeveer 20 km van Bergeijk.`,
    },
    {
      question: `Wat kost ${page.serviceName.toLowerCase()} in ${page.city}?`,
      answer: `${page.price}. De exacte prijs hangt af van ondergrond, oppervlakte, voorbereiding en gewenste afwerking.`,
    },
    {
      question: `Hoe vraag ik een offerte aan voor ${page.serviceName.toLowerCase()} in ${page.city}?`,
      answer: "Gebruik de offertecalculator of neem contact op. Dan plannen we indien nodig advies op locatie.",
    },
  ];

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "${serviceName} ${city}",
        "description": "${description}",
        "provider": {
          "@type": "LocalBusiness",
          "@id": "https://www.stukadoorsteamdekempen.nl/#localbusiness",
          "name": "Stukadoorsteam De Kempen",
          "url": "https://www.stukadoorsteamdekempen.nl/",
          "telephone": "+31 497 123 456",
          "email": "info@stukadoorsteamdekempen.nl"
        },
        "areaServed": { "@type": "Place", "name": "${city}" },
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "description": "${price}"
        }
      }
    </script>
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,78px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Stucwerk in ${city}</div>
        <h1>${serviceName} ${city}</h1>
        <p>${serviceIntro}</p>
        <p><strong>${price}</strong></p>
        <a class="cta" href="/${page.serviceSlug}">Meer over ${serviceName.toLowerCase()}</a>
      </section>
      <section>
        <h2>${serviceName} laten uitvoeren in ${city}</h2>
        <p>Stukadoorsteam De Kempen helpt met ${serviceName.toLowerCase()} in ${city} en omliggende plaatsen binnen ongeveer 20 km van Bergeijk. U werkt direct met Jeroen, Bram en Kay: korte lijnen, duidelijke afspraken en nette oplevering.</p>
        <div class="grid">
          <article class="card"><strong>Advies op locatie</strong><br />We beoordelen ondergrond, oppervlakte, hoeken en gewenste afwerking.</article>
          <article class="card"><strong>Heldere richtprijs</strong><br />U krijgt vooraf duidelijkheid over m²-prijs, uurtarief of maatwerk.</article>
          <article class="card"><strong>Netjes afgewerkt</strong><br />We werken met aandacht voor afplakken, droogtijd en schilderklaar resultaat.</article>
        </div>
        <h2>Offerte voor ${serviceName.toLowerCase()} in ${city}</h2>
        <p>Vraag online een richtprijs aan of neem contact op voor een afspraak. Wij denken graag mee over de beste oplossing voor uw woning in ${city}.</p>
        <h2>Veelgestelde vragen over ${serviceName.toLowerCase()} in ${city}</h2>
        <div class="grid">
          ${renderFaqCards(faqs)}
        </div>
        <h2>Stukadoor in de buurt van ${city}</h2>
        <p>${renderNearbyCityLinks(page.city)}</p>
        <p><a href="/stukadoor-${citySlug}">Stukadoor ${city}</a> · <a href="/${page.serviceSlug}">${serviceName}</a> · <a href="/stukadoor-prijzen">Richtprijzen</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

for (const page of COMBO_LANDING_PAGES) {
  app.get(`/${page.slug}`, (_req, res) => {
    res.type("html").send(renderComboLandingPage(page));
  });
}

function renderHubPage({
  slug,
  title,
  description,
  label,
  heading,
  intro,
  links,
}: {
  slug: string;
  title: string;
  description: string;
  label: string;
  heading: string;
  intro: string;
  links: SeoLink[];
}) {
  const url = `${BASE_URL}/${slug}`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: heading, href: `/${slug}` },
  ];
  const itemListJsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url,
    inLanguage: "nl-NL",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: links.map((link, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: link.name,
        url: `${BASE_URL}${link.href}`,
      })),
    },
  })}</script>`;
  const linkCards = links
    .map(
      (link) =>
        `<a class="card" href="${escapeHtml(link.href)}"><strong>${escapeHtml(link.name)}</strong><br />Bekijk informatie, richtprijzen en advies.</a>`
    )
    .join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${itemListJsonLd}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:1040px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px;text-decoration:none;color:#1c1917}
      .card strong{color:#172554}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">${escapeHtml(label)}</div>
        <h1>${escapeHtml(heading)}</h1>
        <p>${escapeHtml(intro)}</p>
        <a class="cta" href="/?tab=calculator">Vrijblijvende richtprijs berekenen</a>
      </section>
      <section>
        <h2>Bekijk alle pagina's</h2>
        <div class="grid">
          ${linkCards}
        </div>
        <p><a href="/">Terug naar Stukadoorsteam De Kempen</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

app.get("/werkgebied", (_req, res) => {
  res.type("html").send(
    renderHubPage({
      slug: "werkgebied",
      title: "Werkgebied stukadoor binnen 20 km van Bergeijk | Stukadoorsteam De Kempen",
      description:
        "Bekijk het werkgebied van Stukadoorsteam De Kempen: Bergeijk, Westerhoven, Luyksgestel, Eersel, Valkenswaard, Lommel, Pelt en omliggende dorpen.",
      label: "Werkgebied",
      heading: "Stukadoor per plaats",
      intro:
        "Wij werken bewust lokaal rond Bergeijk, zodat we snel kunnen komen kijken en duidelijke afspraken maken over stucwerk, renovatie, schuurwerk en betonlook.",
      links: LOCAL_LANDING_PAGES.map((page) => ({
        name: `Stukadoor ${page.city}`,
        href: `/${page.slug}`,
      })),
    })
  );
});

app.get("/diensten", (_req, res) => {
  res.type("html").send(
    renderHubPage({
      slug: "diensten",
      title: "Stucwerk diensten | Glad pleisterwerk, schuurwerk, renovatie en betonlook",
      description:
        "Bekijk de stucwerk diensten van Stukadoorsteam De Kempen: glad pleisterwerk, schuurwerk, renovatiestucwerk, betonlook en microcement.",
      label: "Diensten",
      heading: "Stucwerk diensten",
      intro:
        "Jeroen, Bram en Kay helpen met strak pleisterwerk, renovatie van bestaande wanden, ambachtelijk schuurwerk en luxe betonlook of microcement.",
      links: SERVICE_LANDING_PAGES.map((page) => ({
        name: page.name,
        href: `/${page.slug}`,
      })),
    })
  );
});

function renderStukadoorKempenPage() {
  const title = "Stukadoor in de Kempen | Binnen 20 km van Bergeijk";
  const description =
    "Zoekt u een stukadoor in de Kempen? Stukadoorsteam De Kempen helpt met glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook binnen 20 km van Bergeijk.";
  const url = `${BASE_URL}/stukadoor-kempen`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Stukadoor Kempen", href: "/stukadoor-kempen" },
  ];
  const faqs = [
    {
      question: "Wie is Stukadoorsteam De Kempen?",
      answer:
        "Wij zijn Jeroen, Bram en Kay: drie lokale stukadoors die stucwerk uitvoeren binnen ongeveer 20 km van Bergeijk.",
    },
    {
      question: "In welke plaatsen werken jullie als stukadoor?",
      answer:
        "Onder andere in Bergeijk, Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Riethoven, Dommelen, Waalre, Veldhoven, Bladel en Reusel.",
    },
    {
      question: "Welke stucwerk diensten bieden jullie aan?",
      answer:
        "Glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook/microcement. Spackspuiten en dunpleister doen wij niet.",
    },
  ];
  const cityLinks = LOCAL_LANDING_PAGES.map(
    (page) =>
      `<a class="card" href="/${page.slug}"><strong>Stukadoor ${escapeHtml(page.city)}</strong><br />Stucwerk, pleisterwerk en advies in ${escapeHtml(page.city)}.</a>`
  ).join("");
  const serviceLinks = SERVICE_LANDING_PAGES.map(
    (page) =>
      `<a class="card" href="/${page.slug}"><strong>${escapeHtml(page.name)}</strong><br />${escapeHtml(page.price)}</a>`
  ).join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Stukadoor in de Kempen",
      description,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "Stukadoorsteam De Kempen",
        url: BASE_URL,
        telephone: "+31 497 123 456",
        email: "info@stukadoorsteamdekempen.nl",
      },
      areaServed: LOCAL_LANDING_PAGES.map((page) => ({ "@type": "Place", name: page.city })),
    })}</script>
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:1040px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px;text-decoration:none;color:#1c1917}
      .card strong{color:#172554}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Lokale stukadoors</div>
        <h1>Stukadoor in de Kempen</h1>
        <p>Zoekt u een betrouwbare stukadoor in de Brabantse Kempen? Jeroen, Bram en Kay leveren strak stucwerk binnen ongeveer 20 km van Bergeijk, met korte lijnen en duidelijke afspraken.</p>
        <a class="cta" href="/?tab=calculator">Bereken uw richtprijs</a>
      </section>
      <section>
        <h2>Stukadoor per plaats</h2>
        <div class="grid">${cityLinks}</div>
        <h2>Onze stucwerk diensten</h2>
        <div class="grid">${serviceLinks}</div>
        <h2>Veelgestelde vragen</h2>
        <div class="grid">${renderFaqCards(faqs)}</div>
        <p><a href="/werkgebied">Bekijk werkgebied</a> · <a href="/stukadoor-prijzen">Bekijk richtprijzen</a> · <a href="/contact-stukadoor">Neem contact op</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

app.get("/stukadoor-kempen", (_req, res) => {
  res.type("html").send(renderStukadoorKempenPage());
});

app.get("/stukadoor", (_req, res) => {
  res.redirect(301, "/stukadoor-kempen");
});

app.get(["/offerte-calculator", "/offerte-stukadoor-calculator"], (_req, res) => {
  res.redirect(301, "/?tab=calculator");
});

function renderStucwerkKempenPage() {
  const title = "Stucwerk in de Kempen | Glad pleisterwerk, schuurwerk en betonlook";
  const description =
    "Stucwerk in de Kempen nodig? Stukadoorsteam De Kempen verzorgt glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook binnen 20 km van Bergeijk.";
  const url = `${BASE_URL}/stucwerk-kempen`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Stucwerk Kempen", href: "/stucwerk-kempen" },
  ];
  const faqs = [
    {
      question: "Welk stucwerk doen jullie in de Kempen?",
      answer:
        "Glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook/microcement voor wanden, plafonds en badkamers.",
    },
    {
      question: "Wat kost stucwerk in de Kempen?",
      answer:
        "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk tussen €18 en €28 per m². Betonlook is maatwerk.",
    },
    {
      question: "Hoe lang duurt stucwerk drogen?",
      answer:
        "Reken op ongeveer 1 dag droogtijd per millimeter laagdikte. Wacht met schilderen tot het stucwerk volledig licht en droog is.",
    },
  ];
  const serviceLinks = SERVICE_LANDING_PAGES.map(
    (page) =>
      `<a class="card" href="/${page.slug}"><strong>${escapeHtml(page.name)}</strong><br />${escapeHtml(page.intro)}</a>`
  ).join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:1040px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px;text-decoration:none;color:#1c1917}
      .card strong{color:#172554}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Stucwerk Kempen</div>
        <h1>Stucwerk in de Kempen</h1>
        <p>Voor strak stucwerk in de Brabantse Kempen werkt u met Jeroen, Bram en Kay. Wij helpen met pleisterwerk, plafonds, renovatie en betonlook binnen ongeveer 20 km van Bergeijk.</p>
        <a class="cta" href="/stukadoor-prijzen">Bekijk richtprijzen</a>
      </section>
      <section>
        <h2>Soorten stucwerk</h2>
        <div class="grid">${serviceLinks}</div>
        <h2>Veelgestelde vragen over stucwerk</h2>
        <div class="grid">${renderFaqCards(faqs)}</div>
        <p><a href="/stukadoor-kempen">Stukadoor in de Kempen</a> · <a href="/werkgebied">Werkgebied</a> · <a href="/stucwerk-droogtijd">Droogtijd stucwerk</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

function renderSiteOverviewPage() {
  const title = "Site-overzicht | Stukadoorsteam De Kempen";
  const description =
    "Overzicht van alle SEO-pagina's van Stukadoorsteam De Kempen: werkgebied, diensten, prijzen, contact en stukadoor pagina's per plaats.";
  const url = `${BASE_URL}/site-overzicht`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Site-overzicht", href: "/site-overzicht" },
  ];
  const hubLinks = [
    { name: "Stukadoor Kempen", href: "/stukadoor-kempen" },
    { name: "Stucwerk Kempen", href: "/stucwerk-kempen" },
    { name: "Werkgebied", href: "/werkgebied" },
    { name: "Diensten", href: "/diensten" },
    { name: "Stukadoor prijzen", href: "/stukadoor-prijzen" },
    { name: "Contact stukadoor", href: "/contact-stukadoor" },
    { name: "Over ons", href: "/over-ons" },
    { name: "Stucwerk droogtijd", href: "/stucwerk-droogtijd" },
  ];
  const hubCards = hubLinks
    .map((link) => `<a class="card" href="${link.href}"><strong>${escapeHtml(link.name)}</strong></a>`)
    .join("");
  const cityCards = LOCAL_LANDING_PAGES.map(
    (page) => `<a class="card" href="/${page.slug}"><strong>Stukadoor ${escapeHtml(page.city)}</strong></a>`
  ).join("");
  const serviceCards = SERVICE_LANDING_PAGES.map(
    (page) => `<a class="card" href="/${page.slug}"><strong>${escapeHtml(page.name)}</strong></a>`
  ).join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:1040px;margin:0 auto;padding:48px 20px}
      h1{font-size:clamp(36px,6vw,64px);line-height:1;margin:0 0 16px;color:#172554}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px;text-decoration:none;color:#1c1917}
      .card strong{color:#172554}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <h1>Site-overzicht</h1>
      <p>Alle belangrijke pagina's van Stukadoorsteam De Kempen op één plek.</p>
      <h2>Hoofdpagina's</h2>
      <div class="grid">${hubCards}</div>
      <h2>Stukadoor per plaats (${LOCAL_LANDING_PAGES.length})</h2>
      <div class="grid">${cityCards}</div>
      <h2>Diensten (${SERVICE_LANDING_PAGES.length})</h2>
      <div class="grid">${serviceCards}</div>
      <p>Combinatiepagina's per dienst en plaats: ${COMBO_LANDING_PAGES.length} pagina's.</p>
      ${renderSeoFooterNav()}
    </main>
  </body>
</html>`;
}

app.get("/stucwerk-kempen", (_req, res) => {
  res.type("html").send(renderStucwerkKempenPage());
});

app.get("/stucwerk", (_req, res) => {
  res.redirect(301, "/stucwerk-kempen");
});

app.get("/pleisterwerk", (_req, res) => {
  res.redirect(301, "/glad-pleisterwerk");
});

app.get("/site-overzicht", (_req, res) => {
  res.type("html").send(renderSiteOverviewPage());
});

function renderPricingPage() {
  const title = "Stukadoor prijzen | Richtprijzen stucwerk in de Kempen";
  const description =
    "Bekijk richtprijzen voor glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook door Stukadoorsteam De Kempen binnen 20 km van Bergeijk.";
  const url = `${BASE_URL}/stukadoor-prijzen`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Stukadoor prijzen", href: "/stukadoor-prijzen" },
  ];
  const faqs = [
    {
      question: "Wat kost een stukadoor per m2?",
      answer:
        "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk ligt vaak tussen €18 en €28 per m². Renovatie en betonlook zijn afhankelijk van ondergrond en afwerking.",
    },
    {
      question: "Waarom verschilt de prijs per project?",
      answer:
        "De prijs hangt af van oppervlakte, ondergrond, hoeken, plafonds, herstelwerk, afplakken en de gewenste eindafwerking.",
    },
    {
      question: "Kan ik online een richtprijs berekenen?",
      answer:
        "Ja, via de offertecalculator krijgt u snel een indicatie. Voor renovatie en betonlook kijken we graag mee op locatie.",
    },
  ];
  const priceCards = SERVICE_LANDING_PAGES.map(
    (page) =>
      `<article class="card"><strong>${escapeHtml(page.name)}</strong><br />${escapeHtml(page.price)}<br /><a href="/${page.slug}">Meer over ${escapeHtml(page.name.toLowerCase())}</a></article>`
  ).join("");
  const cityPriceLinks = LOCAL_LANDING_PAGES.map(
    (page) =>
      `<a class="card" href="/${page.slug}"><strong>Stukadoor ${escapeHtml(page.city)}</strong><br />Richtprijzen en stucwerk in ${escapeHtml(page.city)}.</a>`
  ).join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderOfferCatalogJsonLd()}
    ${renderFaqJsonLd(faqs)}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Richtprijzen stucwerk</div>
        <h1>Wat kost een stukadoor?</h1>
        <p>De prijs voor stucwerk hangt af van ondergrond, oppervlakte, plafonds, hoeken en gewenste afwerking. Hieronder vindt u praktische richtprijzen voor projecten in de Kempen.</p>
        <a class="cta" href="/?tab=calculator">Bereken uw richtprijs</a>
      </section>
      <section>
        <h2>Richtprijzen per dienst</h2>
        <div class="grid">${priceCards}</div>
        <h2>Stukadoor prijzen per plaats</h2>
        <div class="grid">${cityPriceLinks}</div>
        <h2>Veelgestelde vragen over stukadoor prijzen</h2>
        <div class="grid">${renderFaqCards(faqs)}</div>
        <p><a href="/diensten">Bekijk alle diensten</a> · <a href="/werkgebied">Bekijk werkgebied</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

app.get("/stukadoor-prijzen", (_req, res) => {
  res.type("html").send(renderPricingPage());
});

app.get("/offerte-stukadoor", (_req, res) => {
  res.redirect(301, "/stukadoor-prijzen");
});

app.get("/stukadoor-offerte", (_req, res) => {
  res.redirect(301, "/stukadoor-prijzen");
});

function renderAboutPage() {
  const title = "Over Stukadoorsteam De Kempen | Jeroen, Bram en Kay";
  const description =
    "Maak kennis met Jeroen, Bram en Kay van Stukadoorsteam De Kempen: lokale stukadoors voor glad pleisterwerk, schuurwerk, renovatiestucwerk en betonlook.";
  const url = `${BASE_URL}/over-ons`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Over ons", href: "/over-ons" },
  ];
  const people = [
    {
      name: "Jeroen",
      role: "Specialist glad pleisterwerk en betonlook",
      description: "Jeroen denkt mee over strakke wanden, moderne afwerking en duidelijke voorbereiding.",
    },
    {
      name: "Bram",
      role: "Specialist renovatiestucwerk",
      description: "Bram beoordeelt ondergronden zorgvuldig en helpt bestaande wanden en plafonds weer strak te maken.",
    },
    {
      name: "Kay",
      role: "Specialist schuurwerk en decoratieve afwerking",
      description: "Kay werkt aan nette plafondafwerking, schuurwerk en verzorgde oplevering.",
    },
  ];
  const aboutJsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: title,
    description,
    url,
    inLanguage: "nl-NL",
    about: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Stukadoorsteam De Kempen",
      url: BASE_URL,
      telephone: "+31 497 123 456",
      email: "info@stukadoorsteamdekempen.nl",
    },
    mainEntity: people.map((person) => ({
      "@type": "Person",
      name: person.name,
      jobTitle: person.role,
      worksFor: {
        "@type": "LocalBusiness",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "Stukadoorsteam De Kempen",
      },
    })),
  })}</script>`;
  const peopleCards = people
    .map(
      (person) =>
        `<article class="card"><strong>${escapeHtml(person.name)}</strong><br /><span>${escapeHtml(person.role)}</span><br />${escapeHtml(person.description)}</article>`
    )
    .join("");

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${aboutJsonLd}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .card span{display:inline-block;color:#c2410c;font-weight:700;margin:6px 0}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Lokale vakmannen</div>
        <h1>Over Stukadoorsteam De Kempen</h1>
        <p>Wij zijn Jeroen, Bram en Kay. U hebt direct contact met de vakmannen die het werk beoordelen, plannen en uitvoeren.</p>
        <a class="cta" href="/?tab=contact">Vraag advies aan</a>
      </section>
      <section>
        <h2>Wie komt er bij u stukadoren?</h2>
        <div class="grid">${peopleCards}</div>
        <h2>Waarom dat belangrijk is</h2>
        <p>Bij stucwerk draait het om vertrouwen, voorbereiding en nette oplevering. Daarom werken wij met korte lijnen, duidelijke afspraken en advies op basis van de ondergrond in uw woning.</p>
        <p><a href="/diensten">Bekijk onze diensten</a> · <a href="/werkgebied">Bekijk ons werkgebied</a> · <a href="/stukadoor-prijzen">Bekijk richtprijzen</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

app.get("/over-ons", (_req, res) => {
  res.type("html").send(renderAboutPage());
});

function renderDryingTimePage() {
  const title = "Stucwerk droogtijd | Wanneer schilderen na stucwerk?";
  const description =
    "Lees hoe lang stucwerk moet drogen, wanneer u kunt schilderen en hoe u scheuren voorkomt. Advies van Stukadoorsteam De Kempen.";
  const url = `${BASE_URL}/stucwerk-droogtijd`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Stucwerk droogtijd", href: "/stucwerk-droogtijd" },
  ];
  const faqs = [
    {
      question: "Hoe lang moet stucwerk drogen?",
      answer:
        "Gemiddeld droogt stucwerk ongeveer 1 dag per millimeter laagdikte bij normale temperatuur en goede ventilatie.",
    },
    {
      question: "Wanneer mag ik schilderen na stucwerk?",
      answer:
        "Schilder pas als het stucwerk volledig licht van kleur en droog is. Te vroeg schilderen kan vlekken, slechte hechting of beschadiging geven.",
    },
    {
      question: "Mag de verwarming hoog om stucwerk sneller te drogen?",
      answer:
        "Nee, zet de verwarming niet extreem hoog. Laat stucwerk gelijkmatig drogen om scheuren te voorkomen.",
    },
  ];

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: title,
      description,
      image: LOGO_URL,
      author: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "Stukadoorsteam De Kempen",
      },
      publisher: {
        "@type": "Organization",
        "@id": `${BASE_URL}/#localbusiness`,
        name: "Stukadoorsteam De Kempen",
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
      },
      mainEntityOfPage: url,
    })}</script>
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:900px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <article>
        <section class="hero">
          <div class="label">Advies over stucwerk</div>
          <h1>Hoe lang moet stucwerk drogen?</h1>
          <p>Een goede droogtijd voorkomt scheuren, vlekken en problemen met schilderwerk. Hieronder leest u waar u op moet letten na het stukadoren.</p>
          <a class="cta" href="/stukadoor-prijzen">Bekijk richtprijzen</a>
        </section>
        <h2>Vuistregel voor droogtijd</h2>
        <p>Als richtlijn geldt vaak: ongeveer 1 dag per millimeter laagdikte. Dat hangt af van ventilatie, temperatuur, luchtvochtigheid en de ondergrond. Wacht altijd tot het stucwerk egaal licht van kleur is.</p>
        <h2>Zo droogt stucwerk netjes</h2>
        <div class="grid">
          <article class="card"><strong>Ventileer rustig</strong><br />Zorg voor luchtverversing, maar voorkom harde tocht direct op vers stucwerk.</article>
          <article class="card"><strong>Verwarm gelijkmatig</strong><br />Houd de ruimte op normale temperatuur en zet de verwarming niet maximaal.</article>
          <article class="card"><strong>Schilder niet te vroeg</strong><br />Te vroeg schilderen kan zorgen voor slechte hechting, vlekken of beschadiging.</article>
        </div>
        <h2>Veelgestelde vragen</h2>
        <div class="grid">${renderFaqCards(faqs)}</div>
        <p><a href="/diensten">Bekijk onze diensten</a> · <a href="/werkgebied">Bekijk werkgebied</a> · <a href="/">Home</a></p>
        ${renderSeoFooterNav()}
      </article>
    </main>
  </body>
</html>`;
}

app.get("/stucwerk-droogtijd", (_req, res) => {
  res.type("html").send(renderDryingTimePage());
});

function renderContactPage() {
  const title = "Contact stukadoor | Stukadoorsteam De Kempen";
  const description =
    "Neem contact op met Stukadoorsteam De Kempen voor advies, offertes en stucwerk in de Kempen. Bel, mail of bereken online een richtprijs.";
  const url = `${BASE_URL}/contact-stukadoor`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact-stukadoor" },
  ];
  const faqs = [
    {
      question: "Hoe snel krijg ik reactie op mijn vraag?",
      answer:
        "Wij reageren meestal binnen één werkdag op telefoon, e-mail of offerteaanvragen via de calculator.",
    },
    {
      question: "Is advies op locatie gratis?",
      answer:
        "Voor projecten binnen ons werkgebied denken we graag mee. Bij renovatie en betonlook kijken we indien nodig op locatie mee.",
    },
    {
      question: "In welk gebied werken jullie?",
      answer:
        "Wij werken vooral binnen ongeveer 20 km van Bergeijk, waaronder Eersel, Valkenswaard, Luyksgestel, Lommel, Pelt, Hapert en Steensel.",
    },
  ];
  const contactJsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: title,
    description,
    url,
    inLanguage: "nl-NL",
    mainEntity: {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#localbusiness`,
      name: "Stukadoorsteam De Kempen",
      url: BASE_URL,
      telephone: "+31 497 123 456",
      email: "info@stukadoorsteamdekempen.nl",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+31 497 123 456",
        email: "info@stukadoorsteamdekempen.nl",
        contactType: "customer service",
        areaServed: "NL",
        availableLanguage: ["nl"],
      },
    },
  })}</script>`;

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${renderAlternateLinks(url)}
    ${renderSeoAssets()}
    ${renderSocialImageMeta(title, description)}
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    ${renderWebPageJsonLd(title, description, url)}
    ${renderBreadcrumbJsonLd(breadcrumbItems)}
    ${renderFaqJsonLd(faqs)}
    ${contactJsonLd}
    <style>
      body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
      main{max-width:980px;margin:0 auto;padding:48px 20px}
      .hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
      .label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
      h1{font-size:clamp(40px,7vw,76px);line-height:.92;margin:14px 0 18px;letter-spacing:-.05em}
      h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
      .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
      .card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
      .breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
      .cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
      a{color:#c2410c}
    </style>
  </head>
  <body>
    ${renderSeoSiteHeader()}
    <main>
      ${renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Direct contact met Jeroen, Bram en Kay</div>
        <h1>Contact stukadoor</h1>
        <p>Vraag advies, plan een afspraak of bereken online een richtprijs voor stucwerk in de Kempen.</p>
        <a class="cta" href="/?tab=contact">Stuur een bericht</a>
      </section>
      <section>
        <h2>Bel of mail ons</h2>
        <div class="grid">
          <article class="card"><strong>Telefoon</strong><br /><a href="tel:+31497123456">0497 - 123 456</a></article>
          <article class="card"><strong>E-mail</strong><br /><a href="mailto:info@stukadoorsteamdekempen.nl">info@stukadoorsteamdekempen.nl</a></article>
          <article class="card"><strong>Online richtprijs</strong><br /><a href="/?tab=calculator">Offertecalculator</a></article>
        </div>
        <h2>Veelgestelde vragen over contact</h2>
        <div class="grid">${renderFaqCards(faqs)}</div>
        <p><a href="/stukadoor-prijzen">Bekijk richtprijzen</a> · <a href="/werkgebied">Bekijk werkgebied</a> · <a href="/diensten">Bekijk diensten</a></p>
        ${renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}

app.get("/contact-stukadoor", (_req, res) => {
  res.type("html").send(renderContactPage());
});

app.get("/stukadoor-contact", (_req, res) => {
  res.redirect(301, "/contact-stukadoor");
});

function renderSitemapXml() {
  const baseUrl = "https://www.stukadoorsteamdekempen.nl";
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: "/", priority: "1.0" },
    { loc: "/werkgebied", priority: "0.95" },
    { loc: "/stukadoor-kempen", priority: "0.95" },
    { loc: "/stucwerk-kempen", priority: "0.95" },
    { loc: "/site-overzicht", priority: "0.7" },
    { loc: "/diensten", priority: "0.95" },
    { loc: "/over-ons", priority: "0.9" },
    { loc: "/stukadoor-prijzen", priority: "0.9" },
    { loc: "/contact-stukadoor", priority: "0.9" },
    { loc: "/stucwerk-droogtijd", priority: "0.8" },
    ...LOCAL_LANDING_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: "0.9" })),
    ...SERVICE_LANDING_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: "0.85" })),
    ...COMBO_LANDING_PAGES.map((page) => ({ loc: `/${page.slug}`, priority: "0.7" })),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml").send(renderSitemapXml());
});

// API Routes

// GET /api/health
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// POST /api/quotes - Submit a new quote request
app.post("/api/quotes", (req, res) => {
  const { name, email, phone, city, plasterType, area, description, estimatedPrice } = req.body as QuotePayload;
  const normalizedName = getTrimmedString(name);
  const normalizedEmail = getTrimmedString(email);
  const normalizedPhone = getTrimmedString(phone);
  const normalizedCity = getTrimmedString(city);
  const normalizedPlasterType = getTrimmedString(plasterType);
  const normalizedDescription = getTrimmedString(description);
  const normalizedArea = getNumber(area);
  const normalizedEstimatedPrice = getNumber(estimatedPrice);
  
  if (!normalizedName || !normalizedEmail || !normalizedPhone || !normalizedCity || !normalizedPlasterType) {
    return res.status(400).json({ error: "Vul alstublieft alle verplichte velden in." });
  }

  if (!Number.isFinite(normalizedArea) || normalizedArea < 0) {
    return res.status(400).json({ error: "Vul een geldige oppervlakte in." });
  }

  const quotes = loadQuotes();
  const newQuote: StoredQuote = {
    id: `RFQ-${Date.now()}`,
    name: normalizedName,
    email: normalizedEmail,
    phone: normalizedPhone,
    city: normalizedCity,
    plasterType: normalizedPlasterType,
    area: normalizedArea,
    description: normalizedDescription,
    estimatedPrice: Number.isFinite(normalizedEstimatedPrice) ? normalizedEstimatedPrice : 0,
    status: "Nieuw",
    date: new Date().toISOString()
  };

  quotes.push(newQuote);
  saveQuotes(quotes);

  res.status(201).json({ success: true, quote: newQuote });
});

// GET /api/quotes - Get all quotes (for admin panel)
app.get("/api/quotes", (req, res) => {
  const quotes = loadQuotes();
  // Sort by newest first
  quotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(quotes);
});

// DELETE /api/quotes/:id - Delete/Archive a quote (for admin panel)
app.delete("/api/quotes/:id", (req, res) => {
  const { id } = req.params;
  let quotes = loadQuotes();
  const initialLength = quotes.length;
  quotes = quotes.filter((q) => q.id !== id);
  
  if (quotes.length === initialLength) {
    return res.status(404).json({ error: "Offerte aanvraag niet gevonden." });
  }
  
  saveQuotes(quotes);
  res.json({ success: true, message: "Aanvraag succesvol verwijderd." });
});

// POST /api/chat - Chat with StucAdviseur AI
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body as ChatPayload;
  const normalizedMessage = getTrimmedString(message);

  if (!normalizedMessage) {
    return res.status(400).json({ error: "Bericht is verplicht." });
  }

  if (!ai) {
    return res.status(500).json({ 
      error: "Gemini API sleutel is niet geconfigureerd. Voeg deze toe in de Secrets panel." 
    });
  }

  try {
    // Format conversation history for Gemini if present
    const formattedContents: GeminiContent[] = [];
    
    if (Array.isArray(history)) {
      history.filter(isChatHistoryTurn).forEach((turn) => {
        formattedContents.push({
          role: turn.role,
          parts: [{ text: turn.content.trim() }]
        });
      });
    }
    
    // Add the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: normalizedMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `Je bent "StucAdviseur", de slimme en vriendelijke AI-assistent van Stukadoorsteam De Kempen. 
Stukadoorsteam De Kempen is een lokaal stukadoorsbedrijf bestaande uit 3 ervaren en vakkundige ZZP'ers (Jeroen, Bram, en Kay) uit de Brabantse Kempen.
Jouw doel is om bezoekers op de website te adviseren over al hun stucwerk-vragen, ze te enthousiasmeren, en ze te helpen bij het inschatten van hun project.

Belangrijke bedrijfsinformatie:
- Team: Jeroen (expert in glad pleisterwerk & betonlook), Bram (specialist in renovatie & strak pleisterwerk), Kay (meester in schuurwerk & decoratieve afwerking).
- Regio: Ze werken in de hele Kempen (o.a. Bladel, Reusel, Eersel, Bergeijk, Valkenswaard, Hilvarenbeek, Oirschot, Hapert, Luyksgestel, Hoogeloon).
- Diensten:
  1. Glad Pleisterwerk (wanden & plafonds saus- of behangklaar maken) -> richtprijs €15 - €25 per m²
  2. Schuurwerk (decoratief met mooie draaiende cirkels, vochtregulerend, ideaal voor badkamers/plafonds) -> richtprijs €18 - €28 per m²
  3. Betonlook / Microcement (luxe, waterdichte afwerking voor badkamers, keukens, vloeren) -> richtprijs €95 - €140 per m²
  4. Gevelstuc (buitenzijde van woningen isoleren en stucen) -> richtprijs op aanvraag (maatwerk)
- Droogtijd richtlijn: Stucwerk droogt gemiddeld 1 dag per millimeter dikte (bij een temperatuur van 20 graden en goede ventilatie). Pas als het stucwerk volledig wit/droog is, mag er geschilderd worden!
- Belangrijke waarschuwing: Nooit de kachel op 100% zetten of ramen wagenwijd openzetten bij vers stucwerk; het moet gelijkmatig drogen om scheuren te voorkomen.

Houd je antwoorden altijd in het Nederlands, professioneel, vriendelijk, met een vleugje Brabantse gemoedelijkheid (maar blijf zakelijk en vakkundig). 
Als mensen vragen naar specifieke prijzen of een offerte willen, adviseer ze dan om onze handige "Online Offerte Calculator" op de website te gebruiken of direct het contactformulier in te vullen zodat Jeroen, Bram of Kay contact kan opnemen voor een vrijblijvend advies op locatie.`
      }
    });

    const reply = response.text || "Excuses, ik kon geen antwoord genereren. Probeer het nogmaals.";
    res.json({ reply });
  } catch (error: unknown) {
    console.error("Gemini API Fout:", error);
    res.status(500).json({ error: `Er is een fout opgetreden bij het verwerken van uw vraag: ${getErrorMessage(error)}` });
  }
});

// Serve Vite dev server or static build assets
function configureProductionAssets() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    return;
  }

  const publicPath = path.join(process.cwd(), "public");
  const distPath = path.join(process.cwd(), "dist");
  const indexCandidates = [
    path.join(publicPath, "index.html"),
    path.join(distPath, "index.html"),
  ];

  app.use(express.static(publicPath));
  app.use(express.static(distPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    const indexPath = indexCandidates.find((candidate) => fs.existsSync(candidate));
    if (!indexPath) {
      return next();
    }

    res.sendFile(indexPath, (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

configureProductionAssets();

export default app;

async function bootServer() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server draait op http://localhost:${PORT}`);
    });
  }
}

void bootServer();
