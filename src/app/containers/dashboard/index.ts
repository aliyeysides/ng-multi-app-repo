import {NgModule} from '@angular/core';
import {DashboardComponent} from './dashboard.component';
import {routing} from './dashboard.routing';
import {IdeaListsComponent} from './idea-lists/idea-lists.component';
import {BearishInsightsComponent} from './bearish-insights/bearish-insights.component';
import {BearOfTheWeekComponent} from './bear-of-the-week/bear-of-the-week.component';
import {BestBearIdeasComponent} from './best-bear-ideas/best-bear-ideas.component';
import {UserListsComponent} from './user-lists/user-lists.component';

@NgModule({
  imports: [
    routing,
  ],
  exports: [DashboardComponent],
  declarations: [
    DashboardComponent,
    IdeaListsComponent,
    BearishInsightsComponent,
    BearOfTheWeekComponent,
    BestBearIdeasComponent,
    UserListsComponent,
  ],
  providers: []
})
export class DashboardModule {
}
