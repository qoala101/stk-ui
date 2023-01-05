export type PriceRecord = {
  symbol: string;
  time: number;
  buy_price: number;
  sell_price: number;
};

export type BalanceRecord = {
  symbol: string;
  time: number;
  base_balance: number;
  quote_balance: number;
};
