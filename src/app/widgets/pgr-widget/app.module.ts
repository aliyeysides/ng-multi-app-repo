import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {AccordionModule} from 'ngx-bootstrap/accordion';
import {SymbolSearchService} from '../../services/symbol-search.service';
import {UtilService} from '../../services/util.service';
import {ReportService} from '../../services/report.service';
import {SignalService} from '../../services/signal.service';
import {WidgetSearchComponent} from './widget-search/widget-search.component';

@NgModule({
  declarations: [
    AppComponent,
    WidgetSearchComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule.forRoot()
  ],
  providers: [
    SymbolSearchService,
    SignalService,
    UtilService,
    ReportService
  ],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
}
