export type PriceTick = {
  symbol: string;
  time: number;
  buy_price: number;
  sell_price: number;
};

export type BalanceTick = {
  symbol: string;
  time: number;
  base_balance: number;
  quote_balance: number;
};
