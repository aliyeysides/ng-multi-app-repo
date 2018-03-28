import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AuthGuard} from '../../../shared/guards/auth.guard';
import {CommentaryComponent} from './commentary.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'commentary', component: CommentaryComponent, canActivate: [AuthGuard] }
]);
