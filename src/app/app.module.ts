import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';

import {SharedModule} from './shared/index';
import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core/components/index';
import {APP_CONTAINER_MODULES} from './containers/index';

import {UtilService} from './core/services/util.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES
  ],
  providers: [UtilService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
