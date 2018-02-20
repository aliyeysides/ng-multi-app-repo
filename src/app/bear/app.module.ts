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
import {AuthGuard} from '../shared/guards/auth.guard';
import {loadingMaskConfig} from '../../loading-mask-config';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {SimpleNotificationsModule} from 'angular2-notifications';
import {NotificationsService} from 'angular2-notifications/dist';
import {TooltipModule} from 'ngx-bootstrap';
import {BearOnboardingComponent} from './core/bear-onboarding/bear-onboarding.component';
import {HttpClientModule} from '@angular/common/http';

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
  providers: [UtilService, AuthService, AuthGuard, IdeasService, SignalService, NotificationsService],
  bootstrap: [AppComponent],
  entryComponents: [BearOnboardingComponent]
})
export class AppModule {
}
