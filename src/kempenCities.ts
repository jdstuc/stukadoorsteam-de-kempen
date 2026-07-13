import { LOCAL_LANDING_PAGES, buildCitySlugMap, buildCitiesSeoText } from "../seoRegion";

export const KEMPEN_CITIES = LOCAL_LANDING_PAGES.map((page) => page.city);

export const LOCAL_SEO_CITY_SLUGS: Record<string, string> = buildCitySlugMap();

export const KEMPEN_CITIES_SEO_TEXT = buildCitiesSeoText();
