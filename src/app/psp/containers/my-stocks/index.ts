import {NgModule} from '@angular/core';
import {MyStocksComponent} from './my-stocks.component';
import {routing} from './my-stocks.routing';

@NgModule({
  imports: [routing],
  exports: [MyStocksComponent],
  declarations: [MyStocksComponent],
  providers: []
})
export class MyStocksModule {
}
