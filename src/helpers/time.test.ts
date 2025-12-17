import { describe, expect, it } from "vitest";

import { generateTimeSlots } from "./time";

const timeToMinutes = (time: string) => {
  const [hh, mm, ss] = time.split(":").map((part) => Number(part));
  return hh * 60 + mm + (ss ?? 0) / 60;
};

describe("helpers/time - generateTimeSlots", () => {
  it("gera 38 slots de horário (05:00:00 até 23:30:00)", () => {
    const slots = generateTimeSlots();

    expect(slots).toHaveLength(38);
    expect(slots[0]).toBe("05:00:00");
    expect(slots[slots.length - 1]).toBe("23:30:00");
  });

  it("retorna horários no formato HH:mm:ss", () => {
    const slots = generateTimeSlots();

    for (const slot of slots) {
      expect(slot).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    }

    expect(slots).toContain("08:00:00");
    expect(slots).toContain("14:30:00");
  });

  it("gera horários com intervalos exatos de 30 minutos", () => {
    const slots = generateTimeSlots();

    for (let i = 1; i < slots.length; i++) {
      const prev = timeToMinutes(slots[i - 1]);
      const current = timeToMinutes(slots[i]);
      expect(current - prev).toBe(30);
    }
  });

  it("começa às 05:00:00", () => {
    const slots = generateTimeSlots();
    expect(slots[0]).toBe("05:00:00");
  });

  it("termina às 23:30:00", () => {
    const slots = generateTimeSlots();
    expect(slots[slots.length - 1]).toBe("23:30:00");
  });
});


