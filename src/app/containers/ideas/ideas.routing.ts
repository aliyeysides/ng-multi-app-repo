import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {IdeasComponent} from './ideas.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'ideas', component: IdeasComponent },
  // { path: 'ideas', redirectTo: 'ideas/:listId' },
  // { path: 'ideas/:listId', component: IdeasComponent }
]);


