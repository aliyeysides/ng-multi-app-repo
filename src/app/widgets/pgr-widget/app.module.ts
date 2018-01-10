import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {SymbolSearchService} from '../../services/symbol-search.service';
import {UtilService} from '../../services/util.service';
import {ReportService} from '../../services/report.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AccordionModule.forRoot()
  ],
  providers: [
    SymbolSearchService,
    UtilService,
    ReportService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
