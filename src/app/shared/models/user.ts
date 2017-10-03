import {Base} from './base';

export interface Filter {
  filter: boolean,
  marketCap: number,
  isOptionableStocksOnly: boolean,
  liquidity: number,
  closePrice: number
}

export class User extends Base {
  UID: string;
  StockUpdates: Array<any>;
  enableOptionsPlayDisclaimer: boolean;
  isAmeritradeUser: boolean;
  Stocks: Array<string>;
  stocksFilterValues: Filter;
  enableOptionsPlayVideo: boolean;
  DeletedStocks: Array<any>;
  enableWelcomeGuide: boolean;
  enableDiscoveryEngineBanner: boolean;
}
