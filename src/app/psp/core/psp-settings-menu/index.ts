import {NgModule} from '@angular/core';

import {PspSettingsMenuComponent} from './psp-settings-menu.component';
import {PspNavigatorModule} from '../psp-navigator';
import {SharedModule} from '../../../shared';

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
