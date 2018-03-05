import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {SharedModule} from '../shared/index';

import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core/index';
import {APP_CONTAINER_MODULES} from './containers/index';

import {UtilService} from '../services/util.service';
import {AuthService} from '../services/auth.service';

import {BusyModule} from 'angular2-busy';
import {loadingMaskConfig3} from '../../loading-mask-config';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {NotificationsService} from 'angular2-notifications';
import {SymbolSearchService} from '../services/symbol-search.service';
import {PspAuthGuard} from '../shared/guards/psp-auth.guard';
import {PspOnboardingComponent} from './core/psp-onboarding/psp-onboarding.component';
import {PspOnboardingModule} from './core/psp-onboarding/index';
import {HealthCheckService} from '../services/health-check.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';
import {AuthInterceptor} from '../shared/inteceptors/auth.inteceptor';
import {MarketSummaryModule} from '../bear/core/market-summary';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    PspOnboardingModule,
    MarketSummaryModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    MatProgressSpinnerModule,
    // BusyModule.forRoot(loadingMaskConfig3),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES,
  ],
  providers: [
    UtilService,
    AuthService,
    PspAuthGuard,
    IdeasService,
    HealthCheckService,
    SignalService,
    NotificationsService,
    SymbolSearchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PspOnboardingComponent]
})
export class AppModule {
}
