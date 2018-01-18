import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/index';
import {PspOnboardingComponent} from './psp-onboarding.component';
import {BsModalRef, BsModalService, ModalModule, PaginationConfig, PaginationModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    ModalModule,
    PaginationModule
  ],
  exports: [PspOnboardingComponent],
  declarations: [PspOnboardingComponent],
  providers: [BsModalService, BsModalRef, PaginationConfig]
})
export class PspOnboardingModule {
}
