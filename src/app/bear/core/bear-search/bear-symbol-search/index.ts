import {NgModule} from '@angular/core';

import {SharedModule} from '../../../../shared';
import {BearSymbolSearchComponent} from './bear-symbol-search.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [BearSymbolSearchComponent],
  declarations: [BearSymbolSearchComponent],
  providers: []
})
export class BearSymbolSearchModule {}
