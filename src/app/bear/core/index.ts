import {BearBrandModule} from './bear-brand';
import {BearNavigatorModule} from './bear-navigator';
import {BearMarketSummaryModule} from './market-summary';
import {BearSearchModule} from './bear-search';
import {BearAlertsModule} from './bear-alerts';
import {BearSettingsMenuModule} from './bear-settings-menu';
import {BearOnboardingModule} from './bear-onboarding';
import {BearSymbolSearchModule} from './bear-search/bear-symbol-search';

export const APP_CORE_MODULES = [
  BearBrandModule,
  BearNavigatorModule,
  BearMarketSummaryModule,
  BearSearchModule,
  BearSymbolSearchModule,
  BearAlertsModule,
  BearSettingsMenuModule,
  BearOnboardingModule
];
