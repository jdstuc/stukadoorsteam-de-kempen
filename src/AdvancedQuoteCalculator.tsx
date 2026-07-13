import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  Calculator,
  CheckCircle,
  Clock,
  CornerUpRight,
  Euro,
  FileText,
  Layout,
  Layers,
  Printer,
  Send,
} from "lucide-react";
import {
  AdvancedQuoteData,
  calculateAdvancedQuote,
  formatCurrency,
} from "./advancedQuote";

const KEMPEN_CITIES = [
  "Bladel",
  "Eersel",
  "Reusel",
  "Bergeijk",
  "Valkenswaard",
  "Hapert",
  "Luyksgestel",
  "Hoogeloon",
  "Hilvarenbeek",
  "Oirschot",
  "Knegsel",
  "Steensel",
  "Vessem",
  "Duizel",
  "Wintelre",
];

const initialQuoteData: AdvancedQuoteData = {
  clientName: "",
  clientAddress: "",
  clientCity: "Eersel",
  clientEmail: "",
  clientPhone: "",
  wallsM2: 0,
  ceilingsM2: 0,
  cornerProtectorsM1: 0,
  windowRevealsM1: 0,
  estimatedHours: 0,
  projectDescription: "",
  desiredStartDate: "",
  isComplexSpace: false,
  btwRate: 9,
  privacyAccepted: false,
};

type FieldName = keyof AdvancedQuoteData;

export function AdvancedQuoteCalculator() {
  const [formData, setFormData] = useState<AdvancedQuoteData>(initialQuoteData);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const quoteResult = useMemo(() => calculateAdvancedQuote(formData), [formData]);
  const totalM2 = formData.wallsM2 + formData.ceilingsM2;

  const updateField = (name: FieldName, value: string | boolean) => {
    setFormData((prev) => {
      if (typeof prev[name] === "number") {
        return { ...prev, [name]: Number(value) || 0 };
      }

      if (name === "btwRate") {
        return { ...prev, btwRate: Number(value) === 21 ? 21 : 9 };
      }

      return { ...prev, [name]: value };
    });
  };

  const validateForm = (): string | null => {
    if (!formData.clientName.trim() || !formData.clientEmail.trim() || !formData.clientPhone.trim()) {
      return "Vul uw naam, e-mailadres en telefoonnummer in.";
    }

    if (totalM2 === 0 && formData.estimatedHours === 0) {
      return "Vul de oppervlakte in of, bij een kleine/complexe klus, het aantal geschatte uren.";
    }

    if (!quoteResult.isM2Pricing && formData.estimatedHours <= 0) {
      return "Vul geschatte uren in voor een uurtarief-berekening.";
    }

    if (!formData.privacyAccepted) {
      return "Ga akkoord met het verwerken van uw gegevens voor deze offerte-aanvraag.";
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitStatus(null);

    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ success: false, message: validationError });
      return;
    }

    setIsSubmitting(true);

    try {
      const description = [
        formData.projectDescription || "Uitgebreide offerte-aanvraag via calculator.",
        `Wanden: ${formData.wallsM2} m²`,
        `Plafonds: ${formData.ceilingsM2} m²`,
        `Hoekbeschermers: ${formData.cornerProtectorsM1} m1`,
        `Dagkanten: ${formData.windowRevealsM1} m1`,
        `Prijstype: ${quoteResult.isM2Pricing ? "m²-tarief" : "uurtarief"}`,
        formData.desiredStartDate ? `Gewenste startdatum: ${formData.desiredStartDate}` : "",
        formData.clientAddress ? `Projectadres: ${formData.clientAddress}` : "",
      ].filter(Boolean).join("\n");

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.clientName,
          email: formData.clientEmail,
          phone: formData.clientPhone,
          city: formData.clientCity,
          plasterType: quoteResult.isM2Pricing ? "Uitgebreide m²-calculator" : "Uitgebreide uurtarief-calculator",
          area: totalM2,
          description,
          estimatedPrice: Math.round(quoteResult.total),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Aanvraag kon niet worden opgeslagen.");
      }

      setSubmitted(true);
      setSubmitStatus({
        success: true,
        message: "Uw offerte-aanvraag is ontvangen. Jeroen, Bram of Kay neemt zo snel mogelijk contact met u op.",
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "Er ging iets mis bij het versturen.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="section-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fadeIn">
      <div className="text-center space-y-4 mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-clay-600 block">
          Uitgebreide offertecalculator
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-brand-dark-900">
          Bereken uw stucwerk met live prijsindicatie
        </h1>
        <p className="text-brand-dark-800 text-base max-w-2xl mx-auto">
          Vul wanden, plafonds, hoeken en dagkanten in. U ziet direct een richtprijs — Jeroen, Bram of Kay nemen daarna contact op voor advies op locatie.
        </p>
      </div>

      {submitted && submitStatus?.success ? (
        <div className="bg-white rounded-3xl p-8 text-center shadow-xl border border-brand-beige-200 space-y-6">
          <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-dark-900">Bedankt voor uw aanvraag!</h2>
          <p className="text-brand-dark-800 max-w-md mx-auto">{submitStatus.message}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setSubmitStatus(null);
              setFormData(initialQuoteData);
            }}
            className="bg-brand-clay-500 hover:bg-brand-clay-600 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Nieuwe offerte berekenen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-5 space-y-6">
            {submitStatus && !submitStatus.success && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{submitStatus.message}</span>
              </div>
            )}

            <section className="bg-white p-6 rounded-2xl border border-brand-beige-200 shadow-sm">
              <h2 className="text-sm font-bold text-brand-dark-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                <span className="w-1 h-4 bg-brand-clay-500 rounded-full" /> Werkzaamheden
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <NumberInput icon={<Layers size={14} />} label="Wanden (m²)" value={formData.wallsM2} onChange={(value) => updateField("wallsM2", value)} />
                <NumberInput icon={<Layout size={14} />} label="Plafonds (m²)" value={formData.ceilingsM2} onChange={(value) => updateField("ceilingsM2", value)} />
                <NumberInput icon={<CornerUpRight size={14} />} label="Hoeken (m1)" value={formData.cornerProtectorsM1} onChange={(value) => updateField("cornerProtectorsM1", value)} />
                <NumberInput icon={<ArrowRightLeft size={14} />} label="Dagkanten (m1)" value={formData.windowRevealsM1} onChange={(value) => updateField("windowRevealsM1", value)} />
              </div>

              <div className="mt-6 p-4 bg-brand-beige-50 rounded-xl border border-dashed border-brand-beige-300">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-brand-dark-800 font-medium">Totaal oppervlak:</span>
                  <span className="font-bold text-brand-dark-900">{totalM2} m²</span>
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-white rounded-lg border border-brand-beige-200 hover:border-brand-clay-500 transition-colors mb-3">
                  <input
                    type="checkbox"
                    checked={formData.isComplexSpace}
                    onChange={(event) => updateField("isComplexSpace", event.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-brand-clay-500 rounded"
                  />
                  <span>
                    <span className="text-sm font-bold text-brand-dark-900 block">Bereken op uurtarief</span>
                    <span className="text-[10px] text-brand-dark-800">Voor kleine of complexe klussen met veel detailwerk.</span>
                  </span>
                </label>
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider">
                  <span className="text-brand-dark-800">Prijstype:</span>
                  <span className={quoteResult.isM2Pricing ? "text-green-600" : "text-brand-clay-600"}>
                    {quoteResult.isM2Pricing ? "m²-tarief" : "uurtarief"}
                  </span>
                </div>
              </div>

              {!quoteResult.isM2Pricing && (
                <div className="mt-4">
                  <NumberInput icon={<Clock size={14} />} label="Geschatte uren" value={formData.estimatedHours} onChange={(value) => updateField("estimatedHours", value)} />
                </div>
              )}

              <label className="block mt-4 text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">BTW-tarief</label>
              <select
                value={formData.btwRate}
                onChange={(event) => updateField("btwRate", event.target.value)}
                className="mt-1 w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm text-brand-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-clay-500"
              >
                <option value={9}>9% btw - woning ouder dan 2 jaar</option>
                <option value={21}>21% btw - standaard tarief</option>
              </select>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-brand-beige-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-brand-dark-900 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-brand-clay-500 rounded-full" /> Contactgegevens
              </h2>
              <input value={formData.clientName} onChange={(event) => updateField("clientName", event.target.value)} placeholder="Naam *" className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
              <input value={formData.clientAddress} onChange={(event) => updateField("clientAddress", event.target.value)} placeholder="Projectadres" className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
              <select value={formData.clientCity} onChange={(event) => updateField("clientCity", event.target.value)} className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500">
                {KEMPEN_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="email" value={formData.clientEmail} onChange={(event) => updateField("clientEmail", event.target.value)} placeholder="E-mail *" className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
                <input type="tel" value={formData.clientPhone} onChange={(event) => updateField("clientPhone", event.target.value)} placeholder="Telefoon *" className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
              </div>
              <textarea value={formData.projectDescription} onChange={(event) => updateField("projectDescription", event.target.value)} rows={3} placeholder="Korte omschrijving, bijvoorbeeld nieuwbouw, renovatie of badkamer." className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
              <label className="block text-xs font-semibold text-brand-dark-900 uppercase tracking-wider">Gewenste startdatum</label>
              <input type="date" value={formData.desiredStartDate} onChange={(event) => updateField("desiredStartDate", event.target.value)} className="w-full bg-brand-beige-50 border border-brand-beige-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-clay-500" />
              <label className="flex items-start gap-3 p-4 bg-brand-beige-50 rounded-xl border border-brand-beige-200 cursor-pointer">
                <input type="checkbox" checked={formData.privacyAccepted} onChange={(event) => updateField("privacyAccepted", event.target.checked)} className="w-4 h-4 mt-0.5 accent-brand-clay-500 rounded" />
                <span className="text-xs text-brand-dark-800 leading-relaxed">
                  Ik ga akkoord met het verwerken van mijn gegevens voor het opstellen van een offerte.
                </span>
              </label>
              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-clay-500 hover:bg-brand-clay-600 disabled:bg-brand-clay-300 text-white font-bold py-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? "Versturen..." : <><Send className="w-5 h-5" /><span>Offerte-aanvraag versturen</span></>}
              </button>
            </section>
          </form>

          <aside className="lg:col-span-7">
            <QuotePreview data={formData} totalM2={totalM2} result={quoteResult} />
          </aside>
        </div>
      )}
    </div>
  );
}

function NumberInput({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: number; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1 block">
      <span className="text-xs font-semibold text-brand-dark-800 flex items-center gap-1">
        <span className="text-brand-clay-500">{icon}</span>
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full p-2.5 bg-brand-beige-50 border border-brand-beige-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-clay-500/30 focus:border-brand-clay-500 outline-none"
      />
    </label>
  );
}

function QuotePreview({ data, totalM2, result }: { data: AdvancedQuoteData; totalM2: number; result: ReturnType<typeof calculateAdvancedQuote> }) {
  return (
    <div className="bg-white rounded-3xl border border-brand-beige-200 shadow-xl overflow-hidden sticky top-28">
      <div className="p-6 sm:p-8 border-b border-brand-beige-100 flex items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-beige-100 text-brand-clay-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>Live offerte-preview</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-brand-dark-900 mt-4">Stukadoorsteam De Kempen</h2>
          <p className="text-sm text-brand-dark-800 mt-1">{data.clientName || "Nieuwe offerte-aanvraag"}</p>
          <p className="text-xs text-brand-dark-800">{data.clientAddress || data.clientCity}</p>
        </div>
        <button onClick={() => window.print()} className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-brand-beige-100 text-brand-dark-900 hover:bg-brand-beige-200">
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Oppervlak" value={`${totalM2} m²`} />
          <Stat label="Prijstype" value={result.isM2Pricing ? "m²" : "uur"} />
          <Stat label="BTW" value={`${result.btwRate}%`} />
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-beige-200">
          <table className="w-full text-sm">
            <thead className="bg-brand-beige-50 text-[10px] uppercase tracking-wider text-brand-dark-800">
              <tr>
                <th className="text-left p-3">Omschrijving</th>
                <th className="text-right p-3">Aantal</th>
                <th className="text-right p-3">Subtotaal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige-100">
              {result.breakdown.length > 0 ? result.breakdown.map((item) => (
                <tr key={item.label}>
                  <td className="p-3 text-brand-dark-900">{item.label}</td>
                  <td className="p-3 text-right text-xs text-brand-dark-800">{item.quantity} {item.unit}</td>
                  <td className="p-3 text-right font-semibold text-brand-dark-900">{formatCurrency(item.total)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-sm text-brand-dark-800">Vul werkzaamheden in om de prijsopbouw te bekijken.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-brand-dark-900 text-white p-6 sm:p-8 space-y-3">
        <div className="flex justify-between text-xs text-brand-beige-300">
          <span>Totaal excl. btw</span>
          <span>{formatCurrency(result.totalExclBtw)}</span>
        </div>
        <div className="flex justify-between text-xs text-brand-beige-300">
          <span>BTW ({result.btwRate}%)</span>
          <span>{formatCurrency(result.btwAmount)}</span>
        </div>
        <div className="h-px bg-brand-dark-800 my-4" />
        <div className="flex justify-between items-end gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-brand-clay-400">Totaal indicatie</span>
            <p className="text-[10px] text-brand-beige-300 italic">Inclusief btw en basismaterialen</p>
          </div>
          <span className="font-display text-3xl sm:text-4xl font-black text-brand-clay-500">
            {formatCurrency(result.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-brand-beige-50 rounded-2xl p-4 border border-brand-beige-200">
      <p className="text-[10px] uppercase tracking-wider text-brand-dark-800 font-semibold">{label}</p>
      <p className="font-display font-bold text-lg text-brand-dark-900 mt-1">{value}</p>
    </div>
  );
}
