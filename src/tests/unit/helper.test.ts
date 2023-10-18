import { formatDecimalsFromToken, formatInputTokenValue } from "../../app/util/helper";

describe("formatInputTokenValue", () => {
  it("formats input correctly", () => {
    const base = 123.456;
    const decimals = "2";

    const result = formatInputTokenValue(base, decimals);

    expect(result).toEqual("12345");
  });

  it("handles different inputs", () => {
    const base = 0.001;
    const decimals = "4";

    const result = formatInputTokenValue(base, decimals);

    expect(result).toEqual("10");
  });

  it("handles negative base", () => {
    const base = -500.789;
    const decimals = "3";

    const result = formatInputTokenValue(base, decimals);

    expect(result).toEqual("-500789");
  });
});

describe("formatDecimalsFromToken", () => {
  it("correctly formats decimals from a token", () => {
    expect(formatDecimalsFromToken(123456, "2")).toBe(1234.56);
    expect(formatDecimalsFromToken(1000000, "6")).toBe(1);
  });

  it("handles edge cases", () => {
    expect(formatDecimalsFromToken(0, "4")).toBe(0);
    expect(formatDecimalsFromToken(-500000, "3")).toBe(-500);
  });
});
