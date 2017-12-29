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
import {loadingMaskConfig3} from '../../loading-mask-config';
import {IdeasService} from '../services/ideas.service';
import {SignalService} from '../services/signal.service';

import {NotificationsService} from 'angular2-notifications/dist';
import {SymbolSearchService} from '../services/symbol-search.service';
import {PspAuthGuard} from '../shared/guards/psp-auth.guard';

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
    BusyModule.forRoot(loadingMaskConfig3),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES,
  ],
  providers: [
    UtilService,
    AuthService,
    PspAuthGuard,
    IdeasService,
    SignalService,
    NotificationsService,
    SymbolSearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
