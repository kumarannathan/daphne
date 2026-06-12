export interface StockPrice {
  ticker: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
}

// Fallback prices in case the API is unavailable
const FALLBACK_PRICES: Record<string, number> = {
  VTI: 285.00,
  ELF: 64.00,
  COKE: 710.00,
  DIS: 97.00,
};

export async function fetchStockPrice(ticker: string): Promise<StockPrice> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`;
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    if (!result) throw new Error("No data");

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? FALLBACK_PRICES[ticker];
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
    const change = price - previousClose;
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

    return { ticker, price, previousClose, change, changePercent };
  } catch {
    const price = FALLBACK_PRICES[ticker] ?? 100;
    return { ticker, price, previousClose: price, change: 0, changePercent: 0 };
  }
}

export async function fetchAllPrices(tickers: string[]): Promise<StockPrice[]> {
  return Promise.all(tickers.map(fetchStockPrice));
}
