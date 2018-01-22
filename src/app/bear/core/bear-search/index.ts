import {NgModule} from '@angular/core';
import {BearSearchComponent} from './bear-search.component';
import {SharedModule} from '../../../shared/index';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
  imports: [
    SharedModule,
    TooltipModule
  ],
  exports: [BearSearchComponent],
  declarations: [BearSearchComponent],
  providers: [SymbolSearchService]
})
export class BearSearchModule {
}
