export type TaxStatus = "employee" | "monotributo_services" | "no_work_income";

export type TaxEstimate = {
  monthlyTotal: number | null;
  annualTotal: number | null;
  effectiveRate: number | null;
  category: string | null;
  coverage: "orientative" | "insufficient";
  breakdown: Array<{ label: string; amount: number }>;
  notes: string[];
};

type MonotributoBand = { category: string; annualGrossLimit: number; monthlyPayment: number };

// ARCA: locaciones y prestaciones de servicios, vigente desde 2026-08-01.
export const MONOTRIBUTO_SERVICE_BANDS: MonotributoBand[] = [
  { category: "A", annualGrossLimit: 12_009_410.45, monthlyPayment: 49_527.18 },
  { category: "B", annualGrossLimit: 17_595_182.74, monthlyPayment: 56_379.08 },
  { category: "C", annualGrossLimit: 24_670_494.31, monthlyPayment: 66_020.12 },
  { category: "D", annualGrossLimit: 30_628_651.43, monthlyPayment: 84_612.93 },
  { category: "E", annualGrossLimit: 36_028_231.33, monthlyPayment: 119_811.45 },
  { category: "F", annualGrossLimit: 45_151_659.41, monthlyPayment: 150_784.21 },
  { category: "G", annualGrossLimit: 53_995_798.87, monthlyPayment: 230_312.94 },
  { category: "H", annualGrossLimit: 81_924_660.37, monthlyPayment: 522_706.68 },
  { category: "I", annualGrossLimit: 91_699_761.90, monthlyPayment: 963_747.86 },
  { category: "J", annualGrossLimit: 105_012_519.20, monthlyPayment: 1_167_299.76 },
  { category: "K", annualGrossLimit: 126_610_838.75, monthlyPayment: 1_614_446.04 },
];

const rounded = (value: number) => Math.round(value);

export function estimatePersonalTaxes({ status, monthlyGross }: { status: TaxStatus; monthlyGross: number }): TaxEstimate {
  const gross = Math.max(0, Number.isFinite(monthlyGross) ? monthlyGross : 0);

  if (status === "no_work_income") {
    return { monthlyTotal: 0, annualTotal: 0, effectiveRate: 0, category: null, coverage: "orientative", breakdown: [], notes: ["No incluye impuestos patrimoniales, rentas, consumos ni actividad económica."] };
  }

  if (status === "employee") {
    const breakdown = [
      { label: "Jubilación", amount: rounded(gross * 0.11) },
      { label: "PAMI", amount: rounded(gross * 0.03) },
      { label: "Obra social", amount: rounded(gross * 0.03) },
    ];
    const monthlyTotal = breakdown.reduce((total, item) => total + item.amount, 0);
    return { monthlyTotal, annualTotal: monthlyTotal * 12, effectiveRate: gross ? Math.round((monthlyTotal / gross) * 10_000) / 100 : 0, category: null, coverage: "orientative", breakdown, notes: ["No incluye Ganancias, sindicato, topes previsionales ni particularidades del convenio."] };
  }

  const annualGross = gross * 12;
  const band = MONOTRIBUTO_SERVICE_BANDS.find((item) => annualGross <= item.annualGrossLimit);
  if (!band) {
    return { monthlyTotal: null, annualTotal: null, effectiveRate: null, category: null, coverage: "insufficient", breakdown: [], notes: ["El ingreso anualizado supera el tope vigente del Monotributo para servicios."] };
  }

  const monthlyTotal = rounded(band.monthlyPayment);
  return { monthlyTotal, annualTotal: monthlyTotal * 12, effectiveRate: gross ? Math.round((monthlyTotal / gross) * 10_000) / 100 : 0, category: band.category, coverage: "orientative", breakdown: [{ label: `Cuota categoría ${band.category}`, amount: monthlyTotal }], notes: ["No incluye Ingresos Brutos provincial, adherentes de obra social ni recategorizaciones por otros parámetros."] };
}
