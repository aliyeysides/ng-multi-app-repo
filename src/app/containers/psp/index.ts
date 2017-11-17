import {HealthCheckModule} from './health-check/index';
import {MyStocksModule} from './my-stocks/index';
import {MarketBeatModule} from './market-beat/index';

export const APP_CONTAINER_MODULES = [
  HealthCheckModule,
  MyStocksModule,
  MarketBeatModule
];
