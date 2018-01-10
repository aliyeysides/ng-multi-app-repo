import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

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
    // RouterModule.forRoot(ROUTES, {useHash: true}),
  ],
  providers: [
    SymbolSearchService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
