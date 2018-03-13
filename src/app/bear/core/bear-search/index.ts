import {NgModule} from '@angular/core';
import {BearSearchComponent} from './bear-search.component';
import {SharedModule} from '../../../shared';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {BearSymbolSearchModule} from './bear-symbol-search';

@NgModule({
  imports: [
    SharedModule,
    BearSymbolSearchModule,
    TooltipModule.forRoot()
  ],
  exports: [BearSearchComponent],
  declarations: [BearSearchComponent],
  providers: [SymbolSearchService]
})
export class BearSearchModule {
}
