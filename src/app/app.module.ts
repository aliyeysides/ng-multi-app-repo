import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {ROUTES} from './app.routes';
import {APP_CORE_MODULES} from './core/components/index';
import {APP_CONTAINER_MODULES} from './containers/index';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: true}),
    ...APP_CORE_MODULES,
    ...APP_CONTAINER_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
