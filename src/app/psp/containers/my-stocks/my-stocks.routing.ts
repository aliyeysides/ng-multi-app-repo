import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {AuthGuard} from '../../../shared/auth.guard';
import {MyStocksComponent} from './my-stocks.component';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'my-stocks', component: MyStocksComponent, canActivate: [AuthGuard] },
  { path: 'my-stocks/:symbol', component: MyStocksComponent, canActivate: [AuthGuard] }
]);

