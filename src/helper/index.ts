export const reduceAddress = (address: string | undefined, lengthLeft: number, lengthRight: number) => {
  if (address) {
    const addressLeftPart = address.substring(0, lengthLeft);
    const addressRightPart = address.substring(48 - lengthRight, 48);
    return `${addressLeftPart}...${addressRightPart}`;
  }
  return "Not connected";
};

export const calculateSlippage = (base: string, percent: number | undefined = 0) => {
  const result = (parseFloat(base) * percent) / 100;
  return Math.ceil(result);
};

export const formatInputTokenValue = (base: number, exponent: string) => {
  return base * Math.pow(10, parseFloat(exponent));
};
