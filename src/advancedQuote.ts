export interface AdvancedQuoteData {
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientEmail: string;
  clientPhone: string;
  wallsM2: number;
  ceilingsM2: number;
  cornerProtectorsM1: number;
  windowRevealsM1: number;
  estimatedHours: number;
  projectDescription: string;
  desiredStartDate: string;
  isComplexSpace: boolean;
  btwRate: 9 | 21;
  privacyAccepted: boolean;
}

export interface QuoteBreakdownItem {
  label: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

export interface AdvancedQuoteResult {
  isM2Pricing: boolean;
  breakdown: QuoteBreakdownItem[];
  totalExclBtw: number;
  btwAmount: number;
  btwRate: 9 | 21;
  total: number;
}

export const ADVANCED_PRICING = {
  WALLS_PER_M2: 24,
  CEILINGS_PER_M2: 25,
  CORNER_PROTECTORS_PER_M1: 6,
  WINDOW_REVEALS_PER_M1: 12,
  HOURLY_RATE: 55,
  M2_THRESHOLD: 50,
  VOORSTRIJK_L_PER_100M2: 10,
  VOORSTRIJK_CAN_L: 10,
  VOORSTRIJK_CAN_PRICE: 66,
};

function filterNonZeroItems(items: QuoteBreakdownItem[]): QuoteBreakdownItem[] {
  return items.filter((item) => item.quantity > 0 && item.total > 0);
}

export function calculateVoorstrijk(totalM2: number): { cans: number; total: number } {
  if (totalM2 <= 0) {
    return { cans: 0, total: 0 };
  }

  const litersNeeded = (totalM2 / 100) * ADVANCED_PRICING.VOORSTRIJK_L_PER_100M2;
  const cans = Math.ceil(litersNeeded / ADVANCED_PRICING.VOORSTRIJK_CAN_L);
  return { cans, total: cans * ADVANCED_PRICING.VOORSTRIJK_CAN_PRICE };
}

function voorstrijkLine(totalM2: number): QuoteBreakdownItem | null {
  const { cans, total } = calculateVoorstrijk(totalM2);
  if (cans <= 0 || total <= 0) {
    return null;
  }

  return {
    label: "Voorstrijk",
    quantity: cans,
    unit: "blik",
    price: ADVANCED_PRICING.VOORSTRIJK_CAN_PRICE,
    total,
  };
}

export function calculateAdvancedQuote(data: AdvancedQuoteData): AdvancedQuoteResult {
  const totalM2 = data.wallsM2 + data.ceilingsM2;
  const isM2Pricing = !data.isComplexSpace && totalM2 >= ADVANCED_PRICING.M2_THRESHOLD;
  const cornerTotal = data.cornerProtectorsM1 * ADVANCED_PRICING.CORNER_PROTECTORS_PER_M1;
  const revealsTotal = data.windowRevealsM1 * ADVANCED_PRICING.WINDOW_REVEALS_PER_M1;
  const voorstrijk = voorstrijkLine(totalM2);
  const voorstrijkTotal = voorstrijk?.total ?? 0;

  let totalExclBtw = 0;
  let breakdown: QuoteBreakdownItem[] = [];

  if (isM2Pricing) {
    const wallsTotal = data.wallsM2 * ADVANCED_PRICING.WALLS_PER_M2;
    const ceilingsTotal = data.ceilingsM2 * ADVANCED_PRICING.CEILINGS_PER_M2;

    totalExclBtw = wallsTotal + ceilingsTotal + cornerTotal + revealsTotal + voorstrijkTotal;
    breakdown = filterNonZeroItems([
      { label: "Wanden stucen", quantity: data.wallsM2, unit: "m²", price: ADVANCED_PRICING.WALLS_PER_M2, total: wallsTotal },
      { label: "Plafonds stucen", quantity: data.ceilingsM2, unit: "m²", price: ADVANCED_PRICING.CEILINGS_PER_M2, total: ceilingsTotal },
      { label: "Hoekbeschermers", quantity: data.cornerProtectorsM1, unit: "m1", price: ADVANCED_PRICING.CORNER_PROTECTORS_PER_M1, total: cornerTotal },
      { label: "Dagkanten", quantity: data.windowRevealsM1, unit: "m1", price: ADVANCED_PRICING.WINDOW_REVEALS_PER_M1, total: revealsTotal },
      ...(voorstrijk ? [voorstrijk] : []),
    ]);
  } else {
    const hourlyTotal = data.estimatedHours * ADVANCED_PRICING.HOURLY_RATE;

    totalExclBtw = hourlyTotal + cornerTotal + revealsTotal + voorstrijkTotal;
    breakdown = filterNonZeroItems([
      {
        label: data.isComplexSpace ? "Arbeidsuren complexe ruimte" : "Arbeidsuren kleine klus",
        quantity: data.estimatedHours,
        unit: "uur",
        price: ADVANCED_PRICING.HOURLY_RATE,
        total: hourlyTotal,
      },
      { label: "Hoekbeschermers", quantity: data.cornerProtectorsM1, unit: "m1", price: ADVANCED_PRICING.CORNER_PROTECTORS_PER_M1, total: cornerTotal },
      { label: "Dagkanten", quantity: data.windowRevealsM1, unit: "m1", price: ADVANCED_PRICING.WINDOW_REVEALS_PER_M1, total: revealsTotal },
      ...(voorstrijk ? [voorstrijk] : []),
    ]);
  }

  const btwAmount = totalExclBtw * (data.btwRate / 100);

  return {
    isM2Pricing,
    breakdown,
    totalExclBtw,
    btwAmount,
    btwRate: data.btwRate,
    total: totalExclBtw + btwAmount,
  };
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
}
