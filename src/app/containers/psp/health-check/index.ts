import {NgModule} from '@angular/core';
import {HealthCheckComponent} from './health-check.component';
import {routing} from './health-check.routing';

@NgModule({
  imports: [routing],
  exports: [HealthCheckComponent],
  declarations: [HealthCheckComponent],
  providers: []
})
export class HealthCheckModule {
}

// @NgModule({
//   imports: [
//     routing,
//     SharedModule,
//     ModalModule.forRoot()
//   ],
//   exports: [DashboardComponent],
//   declarations: [
//     DashboardComponent,
//     BearishInsightsComponent,
//     BearOfTheWeekComponent,
//     BestBearIdeasComponent,
//     UserListsComponent,
//     PreviousInsightsModalComponent,
//     PreviousBearsModalComponent,
//     InsightsCommentaryModalComponent,
//     WeeklyCommentaryModalComponent,
//   ],
//   entryComponents: [
//     PreviousInsightsModalComponent,
//     PreviousBearsModalComponent,
//     InsightsCommentaryModalComponent,
//     WeeklyCommentaryModalComponent,
//   ],
//   providers: [BsModalService, WordpressService, DatePipe]
// })
// export class DashboardModule {
// }
