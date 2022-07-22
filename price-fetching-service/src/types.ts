export type Vendor = {
  name: string;
  priceSelector?: string;
  itemUrlSelector?: string;
  baseSearchUrl: string;
  pricingPages: {
    mostExpensive: string;
    leastExpensive: string;
  };
};
