import { describe, expect, it } from "vitest";

import { upsertDoctorSchema } from "./schema";

const validData = {
  name: "Dr. João",
  specialty: "Cardiologia",
  appointmentPriceInCents: 15000,
  availableFromWeekDay: 1,
  availableToWeekDay: 5,
  availableFromTime: "08:00",
  availableToTime: "18:00",
};

describe("actions/upsert-doctor - upsertDoctorSchema", () => {
  it("aceita dados válidos", () => {
    const result = upsertDoctorSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejeita nome vazio (string vazia ou apenas espaços)", () => {
    expect(upsertDoctorSchema.safeParse({ ...validData, name: "" }).success).toBe(
      false,
    );
    expect(
      upsertDoctorSchema.safeParse({ ...validData, name: "   " }).success,
    ).toBe(false);
  });

  it("rejeita especialidade vazia", () => {
    expect(
      upsertDoctorSchema.safeParse({ ...validData, specialty: "" }).success,
    ).toBe(false);
  });

  it("rejeita preço zero ou negativo", () => {
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        appointmentPriceInCents: 0,
      }).success,
    ).toBe(false);
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        appointmentPriceInCents: -1,
      }).success,
    ).toBe(false);
  });

  it("rejeita horário de término anterior ao início", () => {
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableFromTime: "18:00",
        availableToTime: "08:00",
      }).success,
    ).toBe(false);
  });

  it("rejeita horários iguais", () => {
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableFromTime: "08:00",
        availableToTime: "08:00",
      }).success,
    ).toBe(false);
  });

  it("aceita ID válido (opcional)", () => {
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        id: "123e4567-e89b-12d3-a456-426614174000",
      }).success,
    ).toBe(true);
  });

  it("rejeita ID inválido", () => {
    expect(
      upsertDoctorSchema.safeParse({ ...validData, id: "not-a-uuid" }).success,
    ).toBe(false);
  });

  it("aceita dados sem ID (criação)", () => {
    const result = upsertDoctorSchema.safeParse({ ...validData });
    expect(result.success).toBe(true);
  });

  it("valida dias da semana (0-6)", () => {
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableFromWeekDay: -1,
      }).success,
    ).toBe(false);
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableFromWeekDay: 7,
      }).success,
    ).toBe(false);
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableToWeekDay: -1,
      }).success,
    ).toBe(false);
    expect(
      upsertDoctorSchema.safeParse({
        ...validData,
        availableToWeekDay: 7,
      }).success,
    ).toBe(false);
  });

  it("remove espaços em branco do nome e especialidade", () => {
    const result = upsertDoctorSchema.safeParse({
      ...validData,
      name: "  Dr. João  ",
      specialty: "  Cardiologia  ",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data.name).toBe("Dr. João");
    expect(result.data.specialty).toBe("Cardiologia");
  });
});


