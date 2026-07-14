import type { Express } from "express";
import {
  EXTRA_COMPARISON_GUIDES,
  HOWTO_GUIDES,
  PROJECT_PAGES,
  RING_HUB_PAGES,
  ROOM_SERVICE_PAGES,
  TEAM_PERSON_PAGES,
  VERBOUWING_HUB_PAGES,
  buildCityCommercialPages,
  buildRoomComboPages,
  getRingHubCityLinks,
  type CityCommercialPageData,
  type ContentHubPageData,
  type HowToGuideData,
  type ProjectPageData,
  type RingHubPageData,
  type RoomComboPageData,
  type RoomServicePageData,
  type TeamPersonPageData,
} from "./seoExpansion";
import { LOCAL_LANDING_PAGES, REGION_RING_LABELS, getCitySlug } from "./seoRegion";
import type { ComparisonGuideData } from "./seoContentPages";

export interface SeoExpansionContext {
  baseUrl: string;
  escapeHtml: (value: string) => string;
  renderAlternateLinks: (url: string) => string;
  renderSeoAssets: () => string;
  renderSocialImageMeta: (title?: string, description?: string) => string;
  renderWebPageJsonLd: (title: string, description: string, url: string) => string;
  renderBreadcrumbJsonLd: (items: Array<{ name: string; href: string }>) => string;
  renderFaqJsonLd: (faqs: Array<{ question: string; answer: string }>) => string;
  renderSeoSiteHeader: () => string;
  renderSeoFooterNav: () => string;
  renderBreadcrumbNav: (items: Array<{ name: string; href: string }>) => string;
  renderFaqCards: (faqs: Array<{ question: string; answer: string }>) => string;
  renderOfferCatalogJsonLd: () => string;
  renderComparisonGuidePage: (page: ComparisonGuideData) => string;
  renderComparisonTable: (
    leftTitle: string,
    rightTitle: string,
    rows: ComparisonGuideData["rows"]
  ) => string;
  serviceLandingPages: Array<{ slug: string; name: string; price: string }>;
}

const SEO_PAGE_STYLES = `body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
main{max-width:980px;margin:0 auto;padding:48px 20px}
.hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
.label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
h1{font-size:clamp(36px,6vw,68px);line-height:.95;margin:14px 0 18px;letter-spacing:-.05em}
h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
h3{font-size:20px;line-height:1.2;margin:24px 0 8px;color:#172554}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px;text-decoration:none;color:#1c1917}
.card strong{color:#172554}
.hero-image{width:100%;max-height:420px;object-fit:cover;border-radius:24px;margin-top:24px}
.breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
.cta{display:inline-block;margin-top:24px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
a{color:#c2410c}
ol.steps{padding-left:20px}
ol.steps li{margin-bottom:12px}`;

function getProjectCitySlug(cityName: string): string {
  const location = LOCAL_LANDING_PAGES.find((page) => page.city === cityName);
  return location ? getCitySlug(location) : cityName.toLowerCase().replaceAll(" ", "-");
}

export const ROOM_COMBO_PAGES = buildRoomComboPages();
export const KOSTEN_CITY_PAGES = buildCityCommercialPages("kosten");
export const OFFERTE_CITY_PAGES = buildCityCommercialPages("offerte");

function renderSeoDocument(
  ctx: SeoExpansionContext,
  {
    title,
    description,
    slug,
    breadcrumbItems,
    label,
    heading,
    intro,
    bodyHtml,
    extraHead = "",
    faqs,
    ogType = "website",
  }: {
    title: string;
    description: string;
    slug: string;
    breadcrumbItems: Array<{ name: string; href: string }>;
    label: string;
    heading: string;
    intro: string;
    bodyHtml: string;
    extraHead?: string;
    faqs?: Array<{ question: string; answer: string }>;
    ogType?: string;
  }
): string {
  const url = `${ctx.baseUrl}/${slug}`;
  const faqJsonLd = faqs?.length ? ctx.renderFaqJsonLd(faqs) : "";

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ctx.escapeHtml(title)}</title>
    <meta name="description" content="${ctx.escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${url}" />
    ${ctx.renderAlternateLinks(url)}
    ${ctx.renderSeoAssets()}
    ${ctx.renderSocialImageMeta(title, description)}
    <meta property="og:type" content="${ogType}" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${ctx.escapeHtml(title)}" />
    <meta property="og:description" content="${ctx.escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    ${ctx.renderWebPageJsonLd(title, description, url)}
    ${ctx.renderBreadcrumbJsonLd(breadcrumbItems)}
    ${faqJsonLd}
    ${extraHead}
    <style>${SEO_PAGE_STYLES}</style>
  </head>
  <body>
    ${ctx.renderSeoSiteHeader()}
    <main>
      ${ctx.renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">${ctx.escapeHtml(label)}</div>
        <h1>${ctx.escapeHtml(heading)}</h1>
        <p>${ctx.escapeHtml(intro)}</p>
        <a class="cta" href="/?tab=calculator">Bereken uw richtprijs</a>
      </section>
      <section>${bodyHtml}${ctx.renderSeoFooterNav()}</section>
    </main>
  </body>
</html>`;
}

function renderRingHubPage(ctx: SeoExpansionContext, page: RingHubPageData): string {
  const cities = getRingHubCityLinks(page.ring);
  const cityCards = cities
    .map(
      (city) =>
        `<a class="card" href="/${city.slug}"><strong>Stukadoor ${ctx.escapeHtml(city.city)}</strong><br />± ${city.distanceKm} km van Bergeijk · ${ctx.escapeHtml(REGION_RING_LABELS[city.ring])}</a>`
    )
    .join("");

  return renderSeoDocument(ctx, {
    title: page.title,
    description: page.description,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Werkgebied", href: "/werkgebied" },
      { name: page.heading, href: `/${page.slug}` },
    ],
    label: page.label,
    heading: page.heading,
    intro: page.intro,
    bodyHtml: `<h2>Plaatsen in ${ctx.escapeHtml(page.label.toLowerCase())}</h2><div class="grid">${cityCards}</div>
      <p><a href="/stukadoor-rondom-bergeijk">Alle regio's rond Bergeijk</a> · <a href="/kosten-stucwerk">Kosten stucwerk</a></p>`,
  });
}

function renderRoomServicePage(ctx: SeoExpansionContext, page: RoomServicePageData): string {
  const cityLinks = LOCAL_LANDING_PAGES.slice(0, 12)
    .map(
      (city) =>
        `<a class="card" href="/${page.slug}-${city.slug.replace("stukadoor-", "")}"><strong>${ctx.escapeHtml(page.name)} ${ctx.escapeHtml(city.city)}</strong></a>`
    )
    .join("");

  return renderSeoDocument(ctx, {
    title: `${page.name} | Stukadoorsteam De Kempen`,
    description: `${page.intro.slice(0, 155)}…`,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Diensten", href: "/diensten" },
      { name: page.name, href: `/${page.slug}` },
    ],
    label: "Ruimte & toepassing",
    heading: page.name,
    intro: page.intro,
    faqs: page.faqs,
    bodyHtml: `<img class="hero-image" src="${ctx.escapeHtml(page.image)}" alt="${ctx.escapeHtml(page.imageAlt)}" loading="lazy" />
      <p><strong>Richtprijs:</strong> ${ctx.escapeHtml(page.price)}</p>
      <h2>Veelgestelde vragen</h2>
      <div class="grid">${ctx.renderFaqCards(page.faqs)}</div>
      <h2>${ctx.escapeHtml(page.name)} per plaats</h2>
      <div class="grid">${cityLinks}</div>
      <p><a href="/kosten-stucwerk">Kosten stucwerk</a> · <a href="/veelgestelde-vragen">Meer vragen</a></p>`,
  });
}

function renderRoomComboPage(ctx: SeoExpansionContext, page: RoomComboPageData): string {
  const citySlug = page.slug.slice(page.roomSlug.length + 1);
  return renderSeoDocument(ctx, {
    title: `${page.roomName} ${page.city} | Stukadoorsteam De Kempen`,
    description: `${page.roomName} in ${page.city}? ${page.roomIntro.slice(0, 120)}…`,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: page.roomName, href: `/${page.roomSlug}` },
      { name: page.city, href: `/${page.slug}` },
    ],
    label: page.roomName,
    heading: `${page.roomName} ${page.city}`,
    intro: page.roomIntro,
    bodyHtml: `<p><strong>Richtprijs:</strong> ${ctx.escapeHtml(page.price)}</p>
      <p><a href="/stukadoor-${ctx.escapeHtml(citySlug)}">Stukadoor ${ctx.escapeHtml(page.city)}</a> · <a href="/${page.roomSlug}">Meer over ${ctx.escapeHtml(page.roomName.toLowerCase())}</a> · <a href="/kosten-stucwerk-${ctx.escapeHtml(citySlug)}">Kosten in ${ctx.escapeHtml(page.city)}</a></p>`,
  });
}

function renderCityCommercialPage(ctx: SeoExpansionContext, page: CityCommercialPageData): string {
  const isKosten = page.type === "kosten";
  const title = isKosten
    ? `Kosten stucwerk ${page.city} | Prijs per m²`
    : `Offerte stukadoor ${page.city} | Vrijblijvend`;
  const description = isKosten
    ? `Wat kost stucwerk in ${page.city}? Richtprijzen voor glad pleisterwerk, schuurwerk en betonlook. ± ${page.distanceKm} km van Bergeijk.`
    : `Offerte stukadoor in ${page.city}? Bereken online uw richtprijs of vraag vrijblijvend advies. ± ${page.distanceKm} km van Bergeijk.`;
  const heading = isKosten ? `Kosten stucwerk ${page.city}` : `Offerte stukadoor ${page.city}`;
  const label = isKosten ? "Kosten stucwerk" : "Offerte stukadoor";
  const intro = isKosten
    ? `Wilt u weten wat stucwerk kost in ${page.city}? Stukadoorsteam De Kempen werkt vanuit Bergeijk en geeft duidelijke richtprijzen per m².`
    : `Zoekt u een offerte voor stucwerk in ${page.city}? Gebruik onze calculator voor een directe richtprijs of neem contact op voor advies op locatie.`;

  const comboLinks = ctx.serviceLandingPages
    .map(
      (service) =>
        `<a class="card" href="/${service.slug}-${page.citySlug}"><strong>${ctx.escapeHtml(service.name)} ${ctx.escapeHtml(page.city)}</strong><br />${ctx.escapeHtml(service.price)}</a>`
    )
    .join("");
  const faqs = isKosten
    ? [
        {
          question: `Wat kost een stukadoor in ${page.city} per m²?`,
          answer: "Glad pleisterwerk ligt vaak tussen €15 en €25 per m². Schuurwerk tussen €18 en €28 per m². Betonlook is maatwerk vanaf ongeveer €95 per m².",
        },
        {
          question: "Zijn er voorrijkosten?",
          answer: "Nee, binnen ons werkgebied rond Bergeijk rekenen wij geen aparte voorrijkosten.",
        },
      ]
    : [
        {
          question: `Hoe vraag ik een offerte aan in ${page.city}?`,
          answer: "Via onze online calculator krijgt u direct een richtprijs. Wij reageren meestal binnen één werkdag op aanvragen.",
        },
        {
          question: "Is het advies vrijblijvend?",
          answer: "Ja, u zit nergens aan vast. Wij denken graag mee over uw project.",
        },
      ];

  const extraHead = isKosten ? ctx.renderOfferCatalogJsonLd() : "";

  return renderSeoDocument(ctx, {
    title,
    description,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: isKosten ? "Kosten stucwerk" : "Offerte stukadoor", href: isKosten ? "/kosten-stucwerk" : "/offerte-stukadoor" },
      { name: heading, href: `/${page.slug}` },
    ],
    label,
    heading,
    intro,
    faqs,
    extraHead,
    bodyHtml: `<h2>Stucwerk prijzen per dienst in ${ctx.escapeHtml(page.city)}</h2>
      <div class="grid">${comboLinks}</div>
      <h2>Veelgestelde vragen</h2>
      <div class="grid">${ctx.renderFaqCards(faqs)}</div>
      <p><a href="/stukadoor-${ctx.escapeHtml(page.citySlug)}">Stukadoor ${ctx.escapeHtml(page.city)}</a> · <a href="/${isKosten ? "offerte" : "kosten"}-stukadoor-${ctx.escapeHtml(page.citySlug)}">${isKosten ? "Offerte" : "Kosten"} ${ctx.escapeHtml(page.city)}</a></p>`,
  });
}

function renderContentHubPage(ctx: SeoExpansionContext, page: ContentHubPageData): string {
  const sections = page.sections
    .map((section) => `<h2>${ctx.escapeHtml(section.heading)}</h2><p>${ctx.escapeHtml(section.body)}</p>`)
    .join("");
  const relatedLinks = page.relatedLinks
    .map((link) => `<a class="card" href="${ctx.escapeHtml(link.href)}"><strong>${ctx.escapeHtml(link.name)}</strong></a>`)
    .join("");

  return renderSeoDocument(ctx, {
    title: page.title,
    description: page.description,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: page.heading, href: `/${page.slug}` },
    ],
    label: page.label,
    heading: page.heading,
    intro: page.intro,
    faqs: page.faqs,
    bodyHtml: `${sections}
      <h2>Veelgestelde vragen</h2>
      <div class="grid">${ctx.renderFaqCards(page.faqs)}</div>
      <h2>Gerelateerde pagina's</h2>
      <div class="grid">${relatedLinks}</div>`,
  });
}

function renderHowToPage(ctx: SeoExpansionContext, page: HowToGuideData): string {
  const url = `${ctx.baseUrl}/${page.slug}`;
  const howToJsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.heading,
    description: page.description,
    url,
    inLanguage: "nl-NL",
    step: page.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  })}</script>`;
  const steps = page.steps
    .map((step) => `<li><strong>${ctx.escapeHtml(step.name)}</strong> — ${ctx.escapeHtml(step.text)}</li>`)
    .join("");

  return renderSeoDocument(ctx, {
    title: page.title,
    description: page.description,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Veelgestelde vragen", href: "/veelgestelde-vragen" },
      { name: page.heading, href: `/${page.slug}` },
    ],
    label: page.label,
    heading: page.heading,
    intro: page.intro,
    faqs: page.faqs,
    ogType: "article",
    extraHead: howToJsonLd,
    bodyHtml: `<h2>Stappen</h2><ol class="steps">${steps}</ol>
      <h2>Veelgestelde vragen</h2>
      <div class="grid">${ctx.renderFaqCards(page.faqs)}</div>`,
  });
}

function renderTeamPersonPage(ctx: SeoExpansionContext, page: TeamPersonPageData): string {
  const skills = page.skills.map((skill) => `<li>${ctx.escapeHtml(skill)}</li>`).join("");

  return renderSeoDocument(ctx, {
    title: `${page.name} | Stukadoorsteam De Kempen`,
    description: `${page.bio.slice(0, 155)}…`,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Over ons", href: "/over-ons" },
      { name: page.name, href: `/${page.slug}` },
    ],
    label: "Ons team",
    heading: page.name,
    intro: page.bio,
    bodyHtml: `<img class="hero-image" src="${ctx.escapeHtml(page.image)}" alt="${ctx.escapeHtml(page.name)} — stukadoor Stukadoorsteam De Kempen" loading="lazy" width="800" height="500" />
      <p><strong>${ctx.escapeHtml(page.role)}</strong><br />${ctx.escapeHtml(page.experience)} · Specialisatie: ${ctx.escapeHtml(page.specialty)}</p>
      <h2>Expertise</h2><ul>${skills}</ul>
      <p><a href="/over-ons">Over ons team</a> · <a href="/contact-stukadoor">Contact opnemen</a></p>`,
  });
}

function renderProjectPage(ctx: SeoExpansionContext, page: ProjectPageData): string {
  return renderSeoDocument(ctx, {
    title: page.title,
    description: page.description,
    slug: page.slug,
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Klantervaringen", href: "/klantervaringen" },
      { name: page.title, href: `/${page.slug}` },
    ],
    label: "Referentie",
    heading: page.title,
    intro: page.summary,
    bodyHtml: `<img class="hero-image" src="${ctx.escapeHtml(page.image)}" alt="${ctx.escapeHtml(page.imageAlt)}" loading="lazy" />
      <p><strong>Plaats:</strong> ${ctx.escapeHtml(page.city)} · <strong>Dienst:</strong> ${ctx.escapeHtml(page.service)}</p>
      <p><a href="/klantervaringen">Meer klantervaringen</a> · <a href="/stukadoor-${ctx.escapeHtml(getProjectCitySlug(page.city))}">Stukadoor ${ctx.escapeHtml(page.city)}</a></p>`,
  });
}

function renderOfferteStukadoorHubPage(ctx: SeoExpansionContext): string {
  const cityLinks = OFFERTE_CITY_PAGES.map(
    (page) =>
      `<a class="card" href="/${page.slug}"><strong>Offerte stukadoor ${ctx.escapeHtml(page.city)}</strong><br />± ${page.distanceKm} km van Bergeijk</a>`
  ).join("");

  return renderSeoDocument(ctx, {
    title: "Offerte stukadoor | Vrijblijvende richtprijs in de Kempen",
    description:
      "Offerte stukadoor nodig in de Kempen? Bereken online uw richtprijs voor glad pleisterwerk, schuurwerk, renovatie en betonlook rond Bergeijk.",
    slug: "offerte-stukadoor",
    breadcrumbItems: [
      { name: "Home", href: "/" },
      { name: "Offerte stukadoor", href: "/offerte-stukadoor" },
    ],
    label: "Offerte stukadoor",
    heading: "Offerte stukadoor in de Kempen",
    intro:
      "Vraag vrijblijvend een richtprijs aan voor stucwerk in Bergeijk en omgeving. Gebruik onze calculator of kies uw plaats voor lokale informatie.",
    bodyHtml: `<h2>Offerte per plaats</h2><div class="grid">${cityLinks}</div>
      <p><a href="/kosten-stucwerk">Kosten stucwerk</a> · <a href="/stukadoor-prijzen">Alle prijzen</a> · <a href="/contact-stukadoor">Contact</a></p>`,
  });
}

export function registerSeoExpansionRoutes(app: Express, ctx: SeoExpansionContext): void {
  for (const page of RING_HUB_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderRingHubPage(ctx, page));
    });
  }

  for (const page of ROOM_SERVICE_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderRoomServicePage(ctx, page));
    });
  }

  for (const page of ROOM_COMBO_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderRoomComboPage(ctx, page));
    });
  }

  for (const page of KOSTEN_CITY_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderCityCommercialPage(ctx, page));
    });
  }

  for (const page of OFFERTE_CITY_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderCityCommercialPage(ctx, page));
    });
  }

  for (const page of VERBOUWING_HUB_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderContentHubPage(ctx, page));
    });
  }

  for (const page of HOWTO_GUIDES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderHowToPage(ctx, page));
    });
  }

  for (const page of TEAM_PERSON_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderTeamPersonPage(ctx, page));
    });
  }

  for (const page of PROJECT_PAGES) {
    app.get(`/${page.slug}`, (_req, res) => {
      res.type("html").send(renderProjectPage(ctx, page));
    });
  }

  for (const guide of EXTRA_COMPARISON_GUIDES) {
    app.get(`/${guide.slug}`, (_req, res) => {
      res.type("html").send(ctx.renderComparisonGuidePage(guide));
    });
  }

  app.get("/offerte-stukadoor", (_req, res) => {
    res.type("html").send(renderOfferteStukadoorHubPage(ctx));
  });
}

export { EXTRA_COMPARISON_GUIDES };
