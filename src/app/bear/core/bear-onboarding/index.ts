import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/index';
import {BearOnboardingComponent} from './bear-onboarding.component';
import {BsModalRef, BsModalService, ModalModule, PaginationConfig, PaginationModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    SharedModule,
    ModalModule,
    PaginationModule
  ],
  exports: [BearOnboardingComponent],
  declarations: [BearOnboardingComponent],
  providers: [BsModalService, BsModalRef, PaginationConfig]
})
export class BearOnboardingModule {
}
