import {NgModule} from '@angular/core';
import {PspSearchComponent} from './psp-search.component';
import {SymbolSearchService} from '../../../services/symbol-search.service';

@NgModule({
  imports: [],
  exports: [PspSearchComponent],
  declarations: [PspSearchComponent],
  providers: [SymbolSearchService]
})
export class PspSearchModule {
}
