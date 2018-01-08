import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {SharedModule} from '../../shared/index';
import {SymbolSearchService} from '../../services/symbol-search.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SharedModule,
    BrowserAnimationsModule,
    // RouterModule.forRoot(ROUTES, {useHash: true}),
    // BusyModule.forRoot(loadingMaskConfig3),
  ],
  providers: [
    // UtilService,
    // AuthService,
    // PspAuthGuard,
    // IdeasService,
    // HealthCheckService,
    // SignalService,
    // NotificationsService,
    SymbolSearchService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
