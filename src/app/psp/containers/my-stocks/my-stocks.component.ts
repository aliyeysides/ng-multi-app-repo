import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {HealthCheckService} from '../../../services/health-check.service';
import {ListSymbolObj} from '../../../shared/models/health-check';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-my-stocks',
  template: `
      <div [ngBusy]="loading" class="container-fluid component component--mystocks">
        <div class="row contents">
          <cpt-my-stocks-list [stocks]="userStocks"></cpt-my-stocks-list>
          <div class="col-12" id="list--recent">
            <h3>Recently Viewed</h3>
            <div class="divider__long"></div>
            <ul class="stock__list">
              <li class="row col-headers">
                <div class="col-3">
                  <p>RATING</p>
                </div>
                <div class="col-3" style="padding-left:0;">
                  <p class="text-left">TICKER</p>
                </div>
                <div class="col-3">
                  <p>PRICE</p>
                </div>
                <div class="col-3">
                  <p>CHG</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
  `,
  styleUrls: ['./my-stocks.component.scss']
})
export class MyStocksComponent implements OnInit {

  private _uid: string;
  private _listId: string;
  private userStocks: ListSymbolObj[];

  loading: Subscription;

  constructor(private authService: AuthService,
              private healthCheck: HealthCheckService) { }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .flatMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .take(1)
      .map(res => this._listId = res[0]['User Lists'][0]['list_id'])
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .subscribe(res => {
        this.userStocks = res['symbols'];
      })
  }

}
