import {NgModule} from '@angular/core';

import {BearNavigatorComponent} from './bear-navigator.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  exports: [BearNavigatorComponent],
  declarations: [BearNavigatorComponent],
  providers: []
})
export class BearNavigatorModule {
}

