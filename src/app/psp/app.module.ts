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
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {NotificationsService} from 'angular2-notifications/dist';
import {SymbolSearchService} from '../services/symbol-search.service';
import {PspAuthGuard} from '../shared/guards/psp-auth.guard';
import {PspOnboardingComponent} from './core/psp-onboarding/psp-onboarding.component';
import {PspOnboardingModule} from './core/psp-onboarding/index';
import {HealthCheckService} from '../services/health-check.service';
import {HttpClientModule} from '@angular/common/http';
import {HttpModule} from '@angular/http';

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
    RouterModule.forRoot(ROUTES, {useHash: true}),
    BusyModule.forRoot(loadingMaskConfig3),
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
    SymbolSearchService
  ],
  bootstrap: [AppComponent],
  entryComponents: [PspOnboardingComponent]
})
export class AppModule {
}
