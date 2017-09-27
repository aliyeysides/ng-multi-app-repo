import {NgModule} from '@angular/core';
import {BearSettingsMenuComponent} from './bear-settings-menu.component';
import {SharedModule} from '../../../shared/index';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [BearSettingsMenuComponent],
  declarations: [BearSettingsMenuComponent],
  providers: []
})
export class BearSettingsMenuModule {
}
