import { describe, expect, it } from "vitest";
import { estimatePersonalTaxes } from "./taxes";

describe("estimatePersonalTaxes", () => {
  it("estimates the standard employee contributions separately", () => {
    const estimate = estimatePersonalTaxes({ status: "employee", monthlyGross: 1_000_000 });

    expect(estimate.monthlyTotal).toBe(170_000);
    expect(estimate.effectiveRate).toBe(17);
    expect(estimate.breakdown).toEqual([
      { label: "Jubilación", amount: 110_000 },
      { label: "PAMI", amount: 30_000 },
      { label: "Obra social", amount: 30_000 },
    ]);
  });

  it("selects the current monotributo service category from annualized income", () => {
    const estimate = estimatePersonalTaxes({ status: "monotributo_services", monthlyGross: 1_200_000 });

    expect(estimate.category).toBe("B");
    expect(estimate.monthlyTotal).toBe(56_379);
    expect(estimate.coverage).toBe("orientative");
  });

  it("marks income above the services ceiling as outside monotributo", () => {
    const estimate = estimatePersonalTaxes({ status: "monotributo_services", monthlyGross: 11_000_000 });

    expect(estimate.category).toBeNull();
    expect(estimate.monthlyTotal).toBeNull();
    expect(estimate.coverage).toBe("insufficient");
  });

  it("returns no recurring work tax for someone without work income", () => {
    const estimate = estimatePersonalTaxes({ status: "no_work_income", monthlyGross: 0 });

    expect(estimate.monthlyTotal).toBe(0);
    expect(estimate.effectiveRate).toBe(0);
  });
});
