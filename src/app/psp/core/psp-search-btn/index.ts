import {NgModule} from '@angular/core';
import {PspSearchBtnComponent} from './psp-search-btn.component';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [SharedModule],
  exports: [PspSearchBtnComponent],
  declarations: [PspSearchBtnComponent],
  providers: [SymbolSearchService]
})
export class PspSearchModule {
}
