import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {IdeasComponent} from './ideas.component';
import {AuthGuard} from '../../shared/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'ideas', component: IdeasComponent, canActivate: [AuthGuard] },
  // { path: 'ideas', redirectTo: 'ideas/:listId' },
  // { path: 'ideas/:listId', component: IdeasComponent }
]);


