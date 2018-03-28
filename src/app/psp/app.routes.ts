import {Routes} from '@angular/router';
import {PspAuthGuard} from '../shared/guards/psp-auth.guard';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'health-check', pathMatch: 'full', canActivate: [PspAuthGuard]},
];
