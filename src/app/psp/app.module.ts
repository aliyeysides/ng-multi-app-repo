import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
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
import {AuthGuard} from '../shared/auth.guard';
import {loadingMaskConfig2} from '../../loading-mask-config';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {SimpleNotificationsModule} from 'angular2-notifications';
import {NotificationsService} from 'angular2-notifications/dist';
import {SymbolSearchService} from '../services/symbol-search.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    BusyModule.forRoot(loadingMaskConfig2),
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
    SymbolSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
