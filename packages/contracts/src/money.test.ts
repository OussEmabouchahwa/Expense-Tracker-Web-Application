import { describe, it, expect } from "vitest";
import { parseMoney, formatMoney, formatSignedMoney } from "./money.js";

describe("parseMoney", () => {
  it("parses valid TND amounts with 3 decimals", () => {
    expect(parseMoney("12.500", "TND")).toBe(12500);
    expect(parseMoney("12,500", "TND")).toBe(12500);
    expect(parseMoney("0.050", "TND")).toBe(50);
    expect(parseMoney("0.001", "TND")).toBe(1);
    expect(parseMoney("100", "TND")).toBe(100000);
    expect(parseMoney("12.5", "TND")).toBe(12500);
    expect(parseMoney("0", "TND")).toBe(0);
    expect(parseMoney("007.250", "TND")).toBe(7250);
  });

  it("parses valid EUR/USD amounts with 2 decimals", () => {
    expect(parseMoney("10.50", "EUR")).toBe(1050);
    expect(parseMoney("10.5", "EUR")).toBe(1050);
    expect(parseMoney("10", "EUR")).toBe(1000);
    expect(parseMoney("0.01", "USD")).toBe(1);
    expect(parseMoney("99.99", "USD")).toBe(9999);
  });

  it("rejects invalid money strings", () => {
    expect(() => parseMoney("", "TND")).toThrow("Amount cannot be empty");
    expect(() => parseMoney("   ", "TND")).toThrow("Amount cannot be empty");
    expect(() => parseMoney("abc", "TND")).toThrow("Invalid money format");
    expect(() => parseMoney("12.34.56", "TND")).toThrow("Invalid money format");
    expect(() => parseMoney("-12.500", "TND")).toThrow("Invalid money format");
    expect(() => parseMoney("1e5", "TND")).toThrow("Scientific notation is not allowed");
    expect(() => parseMoney("1E5", "TND")).toThrow("Scientific notation is not allowed");
  });

  it("rejects fractional part exceeding currency exponent", () => {
    // TND has exponent 3, so 4 decimals is invalid
    expect(() => parseMoney("12.3456", "TND")).toThrow("exceeds maximum allowed precision");
    // EUR has exponent 2, so 3 decimals is invalid
    expect(() => parseMoney("12.345", "EUR")).toThrow("exceeds maximum allowed precision");
  });
});

describe("formatMoney", () => {
  it("formats TND with 3 fixed fraction digits", () => {
    const formatted = formatMoney(12500, "TND", "fr-TN");
    // Should contain 12 and 500
    expect(formatted.replace(/\s/g, " ")).toMatch(/12[,.]500/);
  });

  it("formats zero with fixed fraction digits", () => {
    const formattedTND = formatMoney(0, "TND", "fr-TN");
    expect(formattedTND).toMatch(/0[,.]000/);

    const formattedEUR = formatMoney(0, "EUR", "en-US");
    expect(formattedEUR).toBe("0.00");
  });

  it("formats negative amounts with true minus (U+2212)", () => {
    const formatted = formatMoney(-1500, "EUR", "en-US");
    expect(formatted.startsWith("−")).toBe(true);
    expect(formatted).toBe("−15.00");
  });
});

describe("formatSignedMoney", () => {
  it("formats positive with + sign", () => {
    const result = formatSignedMoney(12500, "TND", "en-US");
    expect(result.sign).toBe("+");
    expect(result.fullFormatted).toBe("+12.500");
  });

  it("formats negative with true minus − sign", () => {
    const result = formatSignedMoney(-12500, "TND", "en-US");
    expect(result.sign).toBe("−");
    expect(result.fullFormatted).toBe("−12.500");
  });

  it("formats zero without sign", () => {
    const result = formatSignedMoney(0, "TND", "en-US");
    expect(result.sign).toBe("");
    expect(result.fullFormatted).toBe("0.000");
  });
});
