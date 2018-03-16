import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';

import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core';
import {APP_CONTAINER_MODULES} from './containers';

import {UtilService} from '../services/util.service';
import {AuthService} from '../services/auth.service';
import {HealthCheckService} from '../services/health-check.service';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';
import {SymbolSearchService} from '../services/symbol-search.service';

import {SharedModule} from '../shared';
import {PspAuthGuard} from '../shared/guards/psp-auth.guard';
import {AuthInterceptor} from '../shared/inteceptors/auth.inteceptor';

import {PspOnboardingComponent} from './core/psp-onboarding/psp-onboarding.component';
import {PspOnboardingModule} from './core/psp-onboarding';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    PspOnboardingModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
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
