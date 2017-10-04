import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Idea} from '../../../shared/models/idea';
import {SignalService} from '../../../core/services/signal.service';

@Component({
  selector: 'cpt-discovery-seed',
  template: `
    <div class="discovery__base-stock container-fluid">
      <div class="row no-gutters">
        <div class="base-stock__logo">
          <img class="align-absolute" src="{{stock ? stock['logo_url'] : null }}">
        </div>
        <div class="base-stock__symbol">
          <p class="ticker">{{ stock ? stock['symbol'] : null }}</p>
          <p class="company-name">{{ stock ? stock['name'] : null }}</p>
          <p class="company-industry">{{ stock ? stock['industry'] : null }}</p>
        </div>
        <div class="base-stock__price">
          <p class="last-price" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            {{ stock ? stock['Last'] : null }}</p>
          <p class="change" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            {{ stock ? stock['Change'] : null }}</p>
          <p class="percentage" [ngClass]="{'up-change' : stock?.Change > 0, 'down-change' : stock?.Change < 0 }">
            {{ stock ? stock['Percentage'] : null }}%</p>
        </div>
        <div class="base-stock__PGR">
          <img class="" src="{{ appendPGRImage(stock ? stock['PGR'] : null) }}">
          <p class="PGR__text">{{ appendPGRText(stock ? stock['PGR'] : null) }}</p>
        </div>
        <div class="base-stock__factors">
          <ul>
            <li *ngFor="let factor of stock ? stock['significant_factors'] : null ">{{ factor }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../discovery.component.scss']
})
export class DiscoverySeedComponent implements AfterViewInit, OnDestroy {

  @Output('addToListClicked') public addToListClicked = new EventEmitter<object>();
  @Output('viewStockReportClicked') public viewStockReportClicked = new EventEmitter();

  private _metaInfo: BehaviorSubject<Idea> = new BehaviorSubject<Idea>({} as Idea);
  @Input('metaInfo')
  set metaInfo(val: Idea) {
    this._metaInfo.next(val);
  }

  get metaInfo() {
    return this._metaInfo.getValue();
  }

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public stock: Idea;

  constructor(private signalService: SignalService) {
  }

  ngAfterViewInit() {
    this._metaInfo
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.stock = res as Idea;
      })
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public appendPGRImage(pgr: number) {
    return this.signalService.appendPGRImage(pgr);
  }

  public appendPGRText(pgr: number) {
    return this.signalService.appendPGRText(pgr);
  }

  public addToList(val: any) {
  //   this.addToListClicked.emit(val);
  }

  public viewStockReport(symbol: string) {
    this.viewStockReportClicked.emit(symbol);
  }

}
