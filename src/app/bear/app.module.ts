import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {SharedModule} from '../shared';

import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core';
import {APP_CONTAINER_MODULES} from './containers';

import {UtilService} from '../services/util.service';
import {AuthService} from '../services/auth.service';

import {BusyModule} from 'angular2-busy';
import {AuthGuard} from '../shared/guards/auth.guard';
import {loadingMaskConfig} from '../../loading-mask-config';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {SimpleNotificationsModule} from 'angular2-notifications';
import {NotificationsService} from 'angular2-notifications';
import {TooltipModule} from 'ngx-bootstrap';
import {BearOnboardingComponent} from './core/bear-onboarding/bear-onboarding.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../shared/inteceptors/auth.inteceptor';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot(ROUTES, {useHash: true}),
    BusyModule.forRoot(loadingMaskConfig),
    SimpleNotificationsModule.forRoot(),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES,
  ],
  providers: [
    UtilService,
    AuthService,
    AuthGuard,
    IdeasService,
    SignalService,
    NotificationsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [BearOnboardingComponent]
})
export class AppModule {
}
