import {
  BUSINESS_PROFILE,
  getGoogleBusinessProfileUrl,
  getGoogleMapsProfileUrl,
  getGoogleReviewUrl,
  getGoogleSiteVerification,
  getPublicSeoConfig,
} from "./seoBusiness";

export interface GoogleSetupRenderContext {
  baseUrl: string;
  escapeHtml: (value: string) => string;
  renderAlternateLinks: (url: string) => string;
  renderSeoAssets: () => string;
  renderSocialImageMeta: (title?: string, description?: string) => string;
  renderWebPageJsonLd: (title: string, description: string, url: string) => string;
  renderBreadcrumbJsonLd: (items: Array<{ name: string; href: string }>) => string;
  renderSeoSiteHeader: () => string;
  renderSeoFooterNav: () => string;
  renderBreadcrumbNav: (items: Array<{ name: string; href: string }>) => string;
}

const PAGE_STYLES = `body{margin:0;font-family:Inter,Arial,sans-serif;background:#faf9f6;color:#1c1917;line-height:1.6}
main{max-width:980px;margin:0 auto;padding:48px 20px}
.hero{background:#172554;color:#fff;border-radius:28px;padding:40px;box-shadow:0 24px 70px rgba(15,23,42,.18)}
.label{color:#fb923c;text-transform:uppercase;letter-spacing:.18em;font-size:12px;font-weight:800}
h1{font-size:clamp(36px,6vw,64px);line-height:.95;margin:14px 0 18px;letter-spacing:-.05em}
h2{font-size:28px;line-height:1.15;margin:36px 0 12px;color:#172554}
h3{font-size:20px;line-height:1.2;margin:24px 0 8px;color:#172554}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:24px}
.card{background:#fff;border:1px solid #e7e5e4;border-radius:20px;padding:20px}
.card strong{color:#172554}
.note{background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:16px 20px;margin:20px 0}
.breadcrumb{font-size:13px;margin-bottom:18px;display:flex;gap:8px;flex-wrap:wrap;color:#78716c}
.cta{display:inline-block;margin-top:16px;margin-right:12px;background:#f97316;color:#fff;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800}
.cta-secondary{display:inline-block;margin-top:16px;background:#fff;color:#172554;padding:14px 20px;border-radius:14px;text-decoration:none;font-weight:800;border:1px solid #e7e5e4}
ol.steps{padding-left:20px}
ol.steps li{margin-bottom:10px}
code{background:#f5f5f4;padding:2px 6px;border-radius:6px;font-size:14px}
a{color:#c2410c}`;

function renderProfileActions(ctx: GoogleSetupRenderContext): string {
  const profileUrl = getGoogleBusinessProfileUrl();
  const reviewUrl = getGoogleReviewUrl();
  const mapsUrl = getGoogleMapsProfileUrl();

  if (profileUrl) {
    return `<div class="grid">
      <article class="card"><strong>Google bedrijfsprofiel</strong><br />Bekijk ons profiel op Google Maps.<br /><a class="cta" href="${ctx.escapeHtml(profileUrl)}" target="_blank" rel="noopener noreferrer">Open profiel</a></article>
      ${
        reviewUrl
          ? `<article class="card"><strong>Review achterlaten</strong><br />Tevreden klant? Deel uw ervaring op Google.<br /><a class="cta" href="${ctx.escapeHtml(reviewUrl)}" target="_blank" rel="noopener noreferrer">Schrijf een review</a></article>`
          : ""
      }
      <article class="card"><strong>Route &amp; werkgebied</strong><br />Vind ons op de kaart rond Bergeijk.<br /><a class="cta-secondary" href="${ctx.escapeHtml(mapsUrl)}" target="_blank" rel="noopener noreferrer">Open Google Maps</a></article>
    </div>`;
  }

  return `<div class="note">
      <strong>Google bedrijfsprofiel wordt nog gekoppeld.</strong>
      Zoek ons intussen op Google Maps rond Bergeijk of neem contact op voor advies.
      <br /><a class="cta-secondary" href="${ctx.escapeHtml(mapsUrl)}" target="_blank" rel="noopener noreferrer">Zoek op Google Maps</a>
    </div>`;
}

function renderOwnerSetup(ctx: GoogleSetupRenderContext): string {
  const hasVerification = Boolean(getGoogleSiteVerification());

  return `<h2>Voor de eigenaar: Google Search Console</h2>
    <ol class="steps">
      <li>Ga naar <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console</a>.</li>
      <li>Voeg property toe: <code>${ctx.escapeHtml(BUSINESS_PROFILE.siteUrl)}</code> (URL-prefix).</li>
      <li>Kies verificatie via HTML-tag en zet de code in Vercel als <code>GOOGLE_SITE_VERIFICATION</code>.</li>
      <li>Deploy opnieuw. Status: ${hasVerification ? "<strong>verificatiecode staat klaar op de server</strong>" : "<strong>nog geen code ingesteld</strong>"}.</li>
      <li>Dien sitemap in: <code>${ctx.escapeHtml(BUSINESS_PROFILE.sitemapUrl)}</code>.</li>
      <li>Vraag indexering aan voor homepage en belangrijke pagina&apos;s (bijv. <code>/stukadoor-bergeijk</code>, <code>/kosten-stucwerk</code>).</li>
    </ol>
    <h2>Voor de eigenaar: Google Business Profile</h2>
    <ol class="steps">
      <li>Ga naar <a href="https://business.google.com" target="_blank" rel="noopener noreferrer">business.google.com</a> en maak/claim het profiel.</li>
      <li>Gebruik exact dezelfde NAP-gegevens als op de website (zie hieronder).</li>
      <li>Primair categorie: <strong>Stukadoor</strong>. Extra: pleisterwerk, renovatie, badkamer afwerking.</li>
      <li>Servicegebied: Bergeijk + ca. 20 km (Kempen).</li>
      <li>Upload foto&apos;s van echt stucwerk (hero, badkamer, plafond, team).</li>
      <li>Vraag tevreden klanten om een Google-review.</li>
      <li>Zet de profiel-URL in Vercel als <code>GOOGLE_BUSINESS_PROFILE_URL</code> en optioneel <code>GOOGLE_PLACE_ID</code> voor directe review-links.</li>
    </ol>
    <h2>NAP-gegevens (copy-paste voor Google)</h2>
    <div class="card">
      <strong>Naam:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.name)}<br />
      <strong>Plaats:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.locality)}, ${ctx.escapeHtml(BUSINESS_PROFILE.region)}<br />
      <strong>Telefoon:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.phoneDisplay)}<br />
      <strong>E-mail:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.email)}<br />
      <strong>Website:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.siteUrl)}<br />
      <strong>Openingstijden:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.openingHoursSummary)}<br />
      <strong>Werkgebied:</strong> ${ctx.escapeHtml(BUSINESS_PROFILE.serviceArea)}
    </div>`;
}

export function renderGoogleBedrijfsprofielPage(ctx: GoogleSetupRenderContext): string {
  const title = "Google bedrijfsprofiel & vindbaarheid | Stukadoorsteam De Kempen";
  const description =
    "Vind Stukadoorsteam De Kempen op Google Maps, laat een review achter en bekijk hoe we Google Search Console en Google Business Profile koppelen.";
  const slug = "google-bedrijfsprofiel";
  const url = `${ctx.baseUrl}/${slug}`;
  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Google bedrijfsprofiel", href: `/${slug}` },
  ];
  const sameAs = getPublicSeoConfig();
  const profileJsonLd = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${ctx.baseUrl}/#localbusiness`,
    name: BUSINESS_PROFILE.name,
    url: ctx.baseUrl,
    telephone: BUSINESS_PROFILE.phoneDisplay,
    email: BUSINESS_PROFILE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS_PROFILE.locality,
      addressRegion: BUSINESS_PROFILE.region,
      addressCountry: BUSINESS_PROFILE.country,
    },
    ...(sameAs.googleBusinessProfileUrl ? { sameAs: [sameAs.googleBusinessProfileUrl] } : {}),
  })}</script>`;

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
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="nl_NL" />
    <meta property="og:title" content="${ctx.escapeHtml(title)}" />
    <meta property="og:description" content="${ctx.escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    ${ctx.renderWebPageJsonLd(title, description, url)}
    ${ctx.renderBreadcrumbJsonLd(breadcrumbItems)}
    ${profileJsonLd}
    <style>${PAGE_STYLES}</style>
  </head>
  <body>
    ${ctx.renderSeoSiteHeader()}
    <main>
      ${ctx.renderBreadcrumbNav(breadcrumbItems)}
      <section class="hero">
        <div class="label">Google &amp; Maps</div>
        <h1>Vind ons op Google</h1>
        <p>Stukadoorsteam De Kempen werkt vanuit Bergeijk in de Kempen. Via Google Maps en reviews helpen we nieuwe klanten ons te vinden.</p>
      </section>
      <section>
        <h2>Google Maps &amp; reviews</h2>
        ${renderProfileActions(ctx)}
        ${renderOwnerSetup(ctx)}
        <p><a href="/contact-stukadoor">Contact</a> · <a href="/klantervaringen">Klantervaringen</a> · <a href="/stukadoor-bergeijk">Stukadoor Bergeijk</a></p>
        ${ctx.renderSeoFooterNav()}
      </section>
    </main>
  </body>
</html>`;
}
