import {NgModule} from '@angular/core';
import {BearSearchComponent} from './bear-search.component';
import {SharedModule} from '../../../shared/index';
import {SymbolSearchService} from '../../../services/symbol-search.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [BearSearchComponent],
  declarations: [BearSearchComponent],
  providers: [SymbolSearchService]
})
export class BearSearchModule {
}
