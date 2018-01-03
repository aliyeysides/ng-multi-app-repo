import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/index';
import {PspOnboardingComponent} from './psp-onboarding.component';
import {BsModalService, ModalModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    ModalModule
  ],
  exports: [PspOnboardingComponent],
  declarations: [PspOnboardingComponent],
  providers: [BsModalService]
})
export class PspOnboardingModule {}
