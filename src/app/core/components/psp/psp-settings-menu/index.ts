import {NgModule} from '@angular/core';

import {PspSettingsMenuComponent} from './psp-settings-menu.component';
import {PspNavigatorModule} from '../psp-navigator/index';
import {SharedModule} from '../../../../shared/index';

@NgModule({
  imports: [
    SharedModule,
    PspNavigatorModule
  ],
  exports: [PspSettingsMenuComponent],
  declarations: [PspSettingsMenuComponent],
  providers: []
})
export class PspSettingsModule {
}
