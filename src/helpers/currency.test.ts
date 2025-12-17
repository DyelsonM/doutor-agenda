import { describe, expect, it } from "vitest";

import { formatCurrencyInCents } from "./currency";

const normalize = (value: string) =>
  value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

describe("helpers/currency - formatCurrencyInCents", () => {
  it("faz a formatação básica", () => {
    expect(normalize(formatCurrencyInCents(15000))).toBe("R$ 150,00");
    expect(normalize(formatCurrencyInCents(100))).toBe("R$ 1,00");
    expect(normalize(formatCurrencyInCents(1))).toBe("R$ 0,01");
  });

  it("formata valores grandes com separador de milhares", () => {
    expect(normalize(formatCurrencyInCents(100000))).toBe("R$ 1.000,00");
    expect(normalize(formatCurrencyInCents(1500000))).toBe("R$ 15.000,00");
  });

  it("formata valor zero", () => {
    expect(normalize(formatCurrencyInCents(0))).toBe("R$ 0,00");
  });

  it("mantém os centavos corretamente", () => {
    expect(normalize(formatCurrencyInCents(150))).toBe("R$ 1,50");
    expect(normalize(formatCurrencyInCents(99))).toBe("R$ 0,99");
  });

  it("usa o formato brasileiro (R$, vírgula nos decimais e ponto nos milhares)", () => {
    const small = normalize(formatCurrencyInCents(150));
    expect(small).toContain("R$");
    expect(small).toMatch(/^R\$\s?\d+(,\d{2})$/);

    const large = normalize(formatCurrencyInCents(1500000));
    expect(large).toContain("R$");
    expect(large).toContain(".");
    expect(large).toMatch(/^R\$\s?\d{1,3}(\.\d{3})+(,\d{2})$/);
  });
});


