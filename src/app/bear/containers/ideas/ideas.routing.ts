import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {IdeasComponent} from './ideas.component';
import {AuthGuard} from '../../../shared/guards/auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'ideas', component: IdeasComponent, canActivate: [AuthGuard] }
]);


