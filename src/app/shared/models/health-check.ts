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

export interface PGRChanges {
  [key: string]: boolean | {
    "SymbolsTurnedBullish": object[],
    "SymbolsTurnedBearish": object[]
  }
}

export interface EarningsReportSurprises {
  "NegativeEarningSurprises": {
    [key: string]: Array<number>
  },
  "PositiveEarningSurprises": {
    [key: string]: Array<number>
  }
}

export interface EarningsAnalystRevisions {
  "NegativeAnalystRevisions": {
    [key: string]: Array<number>
  },
  "PositiveAnalystRevisions": {
    [key: string]: Array<number>
  }
}

export interface PHCIndustryData {
  "IndustryCode": number,
  "SymbolPGRMappings": Array<Ticker>,
  "IndustryScore": number,
  "IndustryName": string
}

export interface PHCGridData {
  "Industries": Array<PHCIndustryData>
}

export interface PrognosisData {
  TotalSymbols: number,
  PortfolioHealth: number,
  BearishSymbolsCount: number,
  BullishSymbolsCount: number,
  LikelyOutperformPercentage: number,
  NeutralSymbolsCount: number,
  BearishSymbols: string
}

export interface EarningsReport {
  [key: string]: {
  "bearishSymbolCount": number,
    "neturalSymbol": Array<string>,
    "nonPgrSymbolCount": number,
    "bullishSymbolCount": number,
    "neturalSymbolCount": number,
    "bearishSymbol": Array<string>,
    "nonPgrSymbol": Array<string>
    "bullishSymbol": Array<string>
  }
}

export interface ExpectedEarningsReports {
  [key: string]: Array<EarningsReport>
}
