import {NgModule} from '@angular/core';
import {routing} from './dashboard.routing';

import {SharedModule} from '../../shared/index';

import {DashboardComponent} from './dashboard.component';
import {IdeaListsComponent} from './idea-lists/idea-lists.component';
import {BearishInsightsComponent} from './bearish-insights/bearish-insights.component';
import {BearOfTheWeekComponent} from './bear-of-the-week/bear-of-the-week.component';
import {BestBearIdeasComponent} from './best-bear-ideas/best-bear-ideas.component';
import {UserListsComponent} from './user-lists/user-lists.component';

import {BsModalService} from 'ngx-bootstrap';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PreviousInsightsModalComponent} from './bearish-insights/previous-modal/previous-modal.component';
import {PreviousBearsModalComponent} from './bear-of-the-week/previous-modal/previous-modal.component';

@NgModule({
  imports: [
    routing,
    SharedModule,
    ModalModule.forRoot()
  ],
  exports: [DashboardComponent],
  declarations: [
    DashboardComponent,
    IdeaListsComponent,
    BearishInsightsComponent,
    BearOfTheWeekComponent,
    BestBearIdeasComponent,
    UserListsComponent,
    PreviousInsightsModalComponent,
    PreviousBearsModalComponent
  ],
  entryComponents: [PreviousInsightsModalComponent, PreviousBearsModalComponent],
  providers: [BsModalService]
})
export class DashboardModule {
}
