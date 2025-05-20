import { finalPriceCalculator } from "../utils/finalPriceCalculator";
import { describe, expect, test } from "@jest/globals";

describe("finalPriceCalculator", () => {
  test("returns original price when no discount is provided", () => {
    expect(finalPriceCalculator(100, null)).toBe(100);
  });

  test("applies percentage discount correctly", () => {
    const discount = { type: "percentage", value: 20 };
    expect(finalPriceCalculator(200, discount)).toBe(160);
  });

  test("applies fixed discount correctly", () => {
    const discount = { type: "fixed", value: 50 };
    expect(finalPriceCalculator(200, discount)).toBe(150);
  });

  test("final price does not go below 0 for percentage discount", () => {
    const discount = { type: "percentage", value: 200 };
    expect(finalPriceCalculator(100, discount)).toBe(0);
  });

  test("final price does not go below 0 for fixed discount", () => {
    const discount = { type: "fixed", value: 500 };
    expect(finalPriceCalculator(100, discount)).toBe(0);
  });

  test("handles 0% percentage discount correctly", () => {
    const discount = { type: "percentage", value: 0 };
    expect(finalPriceCalculator(100, discount)).toBe(100);
  });

  test("handles 0 fixed discount correctly", () => {
    const discount = { type: "fixed", value: 0 };
    expect(finalPriceCalculator(100, discount)).toBe(100);
  });
});
