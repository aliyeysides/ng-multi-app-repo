import {NgModule} from '@angular/core';
import {routing} from './ideas.routing';

import {IdeasComponent} from './ideas.component';
import {SharedModule} from '../../shared/index';

@NgModule({
  imports: [
    routing,
    SharedModule
  ],
  exports: [IdeasComponent],
  declarations: [IdeasComponent],
  providers: []
})
export class IdeasModule {}
