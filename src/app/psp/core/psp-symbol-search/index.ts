import {NgModule} from '@angular/core';
import {PspSymbolSearchComponent} from './psp-symbol-search.component';
import {SharedModule} from '../../../shared';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [PspSymbolSearchComponent],
  declarations: [PspSymbolSearchComponent],
  providers: []
})
export class PspSymbolSearchModule {}
