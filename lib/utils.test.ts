import { formatCurrency, formatDate } from "./utils";

describe("Utils", () => {
  describe("formatCurrency", () => {
    it("formats number to IDR currency", () => {
      expect(formatCurrency(1500000)).toBe("Rp 1.500.000");
    });
    
    it("handles zero correctly", () => {
      expect(formatCurrency(0)).toBe("Rp 0");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string to Indonesian format", () => {
      expect(formatDate("2026-08-12")).toBe("12 Agustus 2026");
    });
  });
});
