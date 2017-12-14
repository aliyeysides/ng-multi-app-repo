import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {PortfolioStatus, PrognosisData} from '../../../../shared/models/health-check';
import {Subject} from 'rxjs/Subject';
import {HealthCheckService} from '../../../../services/health-check.service';

@Component({
  selector: 'cpt-psp-portfolio-overview',
  template: `
    <div class="col-12 section--overview" [ngClass]="{
    'section--overview--green': calculations?.avgPercentageChange > 0,
    'section--overview--red': calculations?.avgPercentageChange < 0}">

      <div class="row no-gutters overview__summary">
        <div class="col-12 col-md-4 align-self-center">
          <p class="timespan">LAST WEEK</p>
          <div class="btn-group" dropdown [autoClose]="true">
            <button dropdownToggle type="button" class="btn btn-primary dropdown-toggle">
              {{ selectedListName }}
            </button>
            <ul *dropdownMenu class="dropdown-menu" role="menu">
              <li (click)="selectList(list)" *ngFor="let list of allUserLists" role="menuitem"><a
                class="dropdown-item">{{ list['name'] }}</a></li>
            </ul>
          </div>
        </div>
        <div class="col-12 col-md-4 align-self-center ">
          <p class="data">
            <span class="icon__arrow">
              <img *ngIf="isPortUp()" src="./assets/imgs/icon__thin-arrow--up.svg">
              <img *ngIf="!isPortUp()" src="./assets/imgs/icon__thin-arrow--down.svg">
            </span>
            <sub><span class="plus-minus"
                       *ngIf="isPortUp()">+</span></sub>{{ calculations?.avgPercentageChange | number:'.2-2'
            }}<sub>%</sub>
          </p>
        </div>
        <div class="col-12 col-md-4 align-self-center text-md-left" style="padding:0 10px;">
          <p>Compared to the <span class="market">S&amp;P 500</span> ---
            <span class="market market--change"> 
              <span *ngIf="isSPYUp()">Up +</span>
              <span *ngIf="!isSPYUp()">Down</span>{{ calculations?.SPYPercentageChange | number:'.2-2' }}%
            </span>
            over the same timespan
          </p>
        </div>
      </div>

      <div class="row justify-content-center overview__powerbar">
        <div class="col-12 col-md-8 col-lg-7 powerbar flex-md-last">
          <div (click)="setToggleOptions('Bulls')"
               [ngClass]="{'bullish--more':prognosisData?.BullishSymbolsCount>prognosisData?.BearishSymbolsCount, 'bullish--less':prognosisData?.BullishSymbolsCount<prognosisData?.BearishSymbolsCount,'bullish--same':prognosisData?.BullishSymbolsCount==prognosisData?.BearishSymbolsCount}">
            <p>{{ prognosisData?.BullishSymbolsCount }}</p>
          </div>
          <div (click)="setToggleOptions('Neutral')" class="neutral">
            <p>{{ prognosisData?.NeutralSymbolsCount }}</p>
          </div>
          <div (click)="setToggleOptions('Bears')"
               [ngClass]="{'bearish--more':prognosisData?.BearishSymbolsCount>prognosisData?.BullishSymbolsCount, 'bearish--less':prognosisData?.BearishSymbolsCount<prognosisData?.BullishSymbolsCount,'bearish--same':prognosisData?.BearishSymbolsCount==prognosisData?.BullishSymbolsCount}">
            <p>{{ prognosisData?.BearishSymbolsCount }}</p>
          </div>
        </div>
        <div class="col-12 col-md-4 col-lg-3 align-self-center">
          <p class="label">Chaikin Power Bar <a> <i tooltip="{{ toolTipText }}" class="fa fa-info-circle" aria-hidden="true"></i></a></p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../health-check.component.scss']
})
export class PortfolioOverviewComponent implements OnInit, OnDestroy {
  private _ngUnsubscribe: Subject<void> = new Subject<void>();
  private _data: BehaviorSubject<PrognosisData> = new BehaviorSubject<PrognosisData>({} as PrognosisData);
  private _calc: BehaviorSubject<PortfolioStatus> = new BehaviorSubject<PortfolioStatus>({} as PortfolioStatus);
  private _lists: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([] as object[]);

  toolTipText: string = "The Chaikin Power Bar is your list's report card. It gives the ratio of Bullish stocks (likely to outperform the market) to Bearish stocks (unlikely to perform in the short to medium term) as rated by the Chaikin Power Gauge Rating."
  allUserLists: object[];
  selectedListName: string;

  @Output('listChanged') listChanged: EventEmitter<void> = new EventEmitter<void>();
  @Input('data')
  set data(val: PrognosisData) {
    this._data.next(val);
  }

  get data() {
    return this._data.getValue();
  }

  @Input('calc')
  set calc(val: PortfolioStatus) {
    this._calc.next(val);
  }

  get calc() {
    return this._calc.getValue();
  }


  @Input('lists')
  set lists(val: object[]) {
    this._lists.next(val);
  }

  get lists() {
    return this._lists.getValue();
  }

  prognosisData: PrognosisData;
  calculations: PortfolioStatus;

  constructor(private healthCheck: HealthCheckService) {
  }

  ngOnInit() {
    this._data
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.prognosisData = res);

    this._calc
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.calculations = res);

    this._lists
      .takeUntil(this._ngUnsubscribe)
      .subscribe(res => this.allUserLists = res);

    this.selectedListName = this.healthCheck.currentList;
  }

  ngOnDestroy() {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  isPortUp(): boolean {
    return this.calculations ? this.calculations.avgPercentageChange > 0 : null;
  }

  isSPYUp(): boolean {
    return this.calculations ? this.calculations.SPYPercentageChange > 0 : null;
  }

  setToggleOptions(option: string) {
    this.healthCheck.setToggleOptions(option);
  }

  selectList(list: object) {
    this.selectedListName = list['name'];
    this.healthCheck.currentList = this.selectedListName;
    this.listChanged.emit();
  }

}
