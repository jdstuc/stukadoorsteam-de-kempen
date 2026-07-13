export const KEMPEN_CITIES = [
  "Bergeijk",
  "Westerhoven",
  "Luyksgestel",
  "Eersel",
  "Valkenswaard",
  "Duizel",
  "Hapert",
  "Steensel",
  "Bladel",
  "Reusel",
  "Lommel",
  "Pelt",
  "Riethoven",
  "Dommelen",
  "Borkel en Schaft",
  "Waalre",
  "Veldhoven",
] as const;

export const LOCAL_SEO_CITY_SLUGS: Record<(typeof KEMPEN_CITIES)[number], string> = {
  Bergeijk: "bergeijk",
  Westerhoven: "westerhoven",
  Luyksgestel: "luyksgestel",
  Eersel: "eersel",
  Valkenswaard: "valkenswaard",
  Duizel: "duizel",
  Hapert: "hapert",
  Steensel: "steensel",
  Lommel: "lommel",
  Pelt: "pelt",
  Riethoven: "riethoven",
  Dommelen: "dommelen",
  "Borkel en Schaft": "borkel-en-schaft",
  Waalre: "waalre",
  Veldhoven: "veldhoven",
  Bladel: "bladel",
  Reusel: "reusel",
};

export const KEMPEN_CITIES_SEO_TEXT =
  "Bergeijk, Westerhoven, Luyksgestel, Eersel, Valkenswaard, Duizel, Hapert, Steensel, Lommel, Pelt, Riethoven, Dommelen, Borkel en Schaft, Waalre, Veldhoven, Bladel en Reusel";
