import {NgModule} from '@angular/core';
import {PspSearchComponent} from './psp-search.component';
import {SymbolSearchService} from '../../../services/symbol-search.service';
import {SharedModule} from '../../../../shared/index';

@NgModule({
  imports: [SharedModule],
  exports: [PspSearchComponent],
  declarations: [PspSearchComponent],
  providers: [SymbolSearchService]
})
export class PspSearchModule {
}
