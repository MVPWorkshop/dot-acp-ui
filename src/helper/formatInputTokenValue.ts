export const formatInputTokenValue = (base: number, exponent: string) => {
  return base * Math.pow(10, parseFloat(exponent));
};
