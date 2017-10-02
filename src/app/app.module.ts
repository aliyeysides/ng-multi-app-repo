import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {SharedModule} from './shared/index';

import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core/components/index';
import {APP_CONTAINER_MODULES} from './containers/index';

import {UtilService} from './core/services/util.service';
import {AuthService} from './core/services/auth.service';

import {BusyModule} from 'angular2-busy';
import {AuthGuard} from './shared/auth.guard';
import {loadingMaskConfig} from '../loading-mask-config';

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
    BusyModule.forRoot(loadingMaskConfig),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES,
  ],
  providers: [UtilService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
