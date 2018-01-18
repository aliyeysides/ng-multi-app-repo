import {ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MyStocksComponent} from './my-stocks.component';
import {PspAuthGuard} from '../../../shared/guards/psp-auth.guard';

export const routing: ModuleWithProviders = RouterModule.forChild([
  { path: 'stock-analysis', component: MyStocksComponent, canActivate: [PspAuthGuard] },
  { path: 'stock-analysis/:symbol', component: MyStocksComponent, canActivate: [PspAuthGuard] }
]);

