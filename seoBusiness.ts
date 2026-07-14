const BUSINESS_NAME = "Stukadoorsteam De Kempen";
const BUSINESS_EMAIL = "info@stukadoorsteamdekempen.nl";
const BUSINESS_PHONE_E164 = "+31497123456";
const BUSINESS_PHONE_DISPLAY = "0497 - 123 456";
const BUSINESS_LOCALITY = "Bergeijk";
const BUSINESS_REGION = "Noord-Brabant";
const BUSINESS_COUNTRY = "NL";
const BUSINESS_LAT = 51.319;
const BUSINESS_LNG = 5.358;
const SITEMAP_URL = "https://www.stukadoorsteamdekempen.nl/sitemap.xml";
const SITE_URL = "https://www.stukadoorsteamdekempen.nl";

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getGoogleSiteVerification(): string | undefined {
  return readEnv("GOOGLE_SITE_VERIFICATION");
}

export function getGoogleSiteVerificationFileName(): string | undefined {
  const fileName = readEnv("GOOGLE_SITE_VERIFICATION_FILE");
  if (!fileName || fileName.includes("/") || fileName.includes("..")) {
    return undefined;
  }
  return fileName;
}

export function getGoogleSiteVerificationFileBody(): string | undefined {
  return readEnv("GOOGLE_SITE_VERIFICATION_FILE_BODY");
}

export function getGoogleBusinessProfileUrl(): string | undefined {
  return readEnv("GOOGLE_BUSINESS_PROFILE_URL");
}

export function getGooglePlaceId(): string | undefined {
  return readEnv("GOOGLE_PLACE_ID");
}

export function getGoogleMapsProfileUrl(): string {
  return (
    getGoogleBusinessProfileUrl() ??
    "https://www.google.com/maps/search/?api=1&query=Stukadoorsteam+De+Kempen,Bergeijk,Noord-Brabant"
  );
}

export function getGoogleReviewUrl(): string | undefined {
  const placeId = getGooglePlaceId();
  if (placeId) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
  }
  return getGoogleBusinessProfileUrl();
}

export function getSameAsUrls(): string[] {
  const urls: string[] = [];
  const profileUrl = getGoogleBusinessProfileUrl();
  if (profileUrl) {
    urls.push(profileUrl);
  }
  return urls;
}

export function getPublicSeoConfig() {
  return {
    googleBusinessProfileUrl: getGoogleBusinessProfileUrl() ?? null,
    googleReviewUrl: getGoogleReviewUrl() ?? null,
    googleMapsUrl: getGoogleMapsProfileUrl(),
    hasGoogleBusinessProfile: Boolean(getGoogleBusinessProfileUrl()),
    hasGooglePlaceId: Boolean(getGooglePlaceId()),
    sitemapUrl: SITEMAP_URL,
    siteUrl: SITE_URL,
  };
}

export function injectGoogleSiteVerification(html: string): string {
  const token = getGoogleSiteVerification();
  if (!token || html.includes("google-site-verification")) {
    return html;
  }

  const safeToken = token.replace(/"/g, "&quot;");
  return html.replace(
    "</head>",
    `    <meta name="google-site-verification" content="${safeToken}" />\n  </head>`
  );
}

export const BUSINESS_PROFILE = {
  name: BUSINESS_NAME,
  email: BUSINESS_EMAIL,
  phoneE164: BUSINESS_PHONE_E164,
  phoneDisplay: BUSINESS_PHONE_DISPLAY,
  locality: BUSINESS_LOCALITY,
  region: BUSINESS_REGION,
  country: BUSINESS_COUNTRY,
  latitude: BUSINESS_LAT,
  longitude: BUSINESS_LNG,
  siteUrl: SITE_URL,
  sitemapUrl: SITEMAP_URL,
  category: "Stukadoor",
  serviceArea: "Binnen ongeveer 20 km van Bergeijk (de Kempen)",
  openingHoursSummary: "Ma–vr 07:30–18:00, za 08:00–14:00",
};
