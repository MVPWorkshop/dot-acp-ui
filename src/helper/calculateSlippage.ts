export const calculateSlippage = (base: string, percent: number | undefined) => {
  if (percent === undefined) {
    throw new Error("Percent is undefined. Please provide a valid percent value.");
  }
  const result = (parseFloat(base) * percent) / 100;
  return Math.ceil(result);
};
