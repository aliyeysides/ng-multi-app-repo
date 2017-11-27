export interface StockStatus {
  "symbol": string,
  "corrected_pgr_rating": number,
  "percentageChange": number,
  "companyName": string,
  "raw_pgr_rating": number,
  "closePrice": number,
  "arcColor": number
}

interface Ticker {
  [key: string]: number;
}

export interface PortfolioStatus {
  "SPYPercentageChange": number,
  "LooserStockPercentageChanges": Ticker[],
  "GainerStocksPercentageChanges": Ticker[],
  "avgPercentageChange": number
}
