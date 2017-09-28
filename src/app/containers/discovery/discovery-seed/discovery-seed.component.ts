import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Idea} from '../../../shared/models/idea';
import {SignalService} from '../../../core/services/signal.service';

@Component({
  selector: 'cpt-discovery-seed',
  template: `
    <div class="discovery__base-stock container">
      <div class="row">
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
            {{ stock ? stock['Percentage'] : null }}</p>
        </div>
        <div class="base-stock__actions">
          <a (click)="viewStockReport(stock?.symbol)">
            <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_stockview" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M266.170047,186.953716 C270.088277,186.953716 273.264617,190.130068 273.264617,194.048311 L273.264617,292.906419 C273.264617,296.824662 270.088277,300.001014 266.170047,300.001014 L7.09457063,300.001014 C3.17836764,300.001014 0,296.824662 0,292.906419 L0,33.8280405 C0,29.9097973 3.17836764,26.7334459 7.09457063,26.7334459 L105.954372,26.7334459 C109.872602,26.7334459 113.048942,29.9097973 113.048942,33.8280405 L113.048942,61.1016892 C113.048942,65.0199324 109.872602,68.1962838 105.954372,68.1962838 L41.4626978,68.1962838 L41.4626978,258.536149 L231.803947,258.536149 L231.803947,194.048311 C231.803947,190.130068 234.980287,186.953716 238.898517,186.953716 L266.170047,186.953716 Z M292.905429,0 C296.823659,0 300,3.17635135 300,7.09459459 L300,149.586486 C300,153.50473 296.823659,156.681081 292.905429,156.681081 L266.17106,156.681081 C262.25283,156.681081 259.07649,153.50473 259.07649,149.586486 L259.07649,69.8614865 L160.553174,168.383108 C159.223449,169.712838 157.419401,170.460811 155.536299,170.460811 L136.632309,170.460811 C132.716106,170.460811 129.537738,167.284459 129.537738,163.366216 L129.537738,144.464189 C129.537738,142.581081 130.285708,140.777027 131.617461,139.44527 L230.13875,40.9236486 L150.411992,40.9236486 C146.495789,40.9236486 143.317421,37.7472973 143.317421,33.8290541 L143.317421,7.09459459 C143.317421,3.17635135 146.495789,0 150.411992,0 L292.905429,0 Z"></path>
              </g>
            </svg>
          </a>
          <a (click)="addToList({symbol: stock?.symbol, listName: 'Watching'})">
            <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_watching" stroke="none" stroke-width="1" fill="#000000" fill-rule="evenodd">
                <path
                  d="M117.857143,53.5714286 L46.875,53.5714286 C44.53125,53.5714286 42.3549107,55.078125 41.6852679,57.421875 L0,203.571429 L0,289.285714 C0,295.145089 4.85491071,300 10.7142857,300 L96.4285714,300 C102.287946,300 107.142857,295.145089 107.142857,289.285714 L107.142857,192.857143 C113.002232,192.857143 117.857143,188.002232 117.857143,182.142857 L117.857143,53.5714286 Z M171.428571,53.5714286 L128.571429,53.5714286 L128.571429,171.428571 L171.428571,171.428571 L171.428571,53.5714286 Z M300,203.571429 L258.314732,57.421875 C257.645089,55.078125 255.46875,53.5714286 253.125,53.5714286 L182.142857,53.5714286 L182.142857,182.142857 C182.142857,188.002232 186.997768,192.857143 192.857143,192.857143 L192.857143,289.285714 C192.857143,295.145089 197.712054,300 203.571429,300 L289.285714,300 C295.145089,300 300,295.145089 300,289.285714 L300,203.571429 Z M123.214286,5.35714286 C123.214286,2.34375 120.870536,0 117.857143,0 L69.6428571,0 C66.6294643,0 64.2857143,2.34375 64.2857143,5.35714286 L64.2857143,42.8571429 L123.214286,42.8571429 L123.214286,5.35714286 Z M235.714286,5.35714286 C235.714286,2.34375 233.370536,0 230.357143,0 L182.142857,0 C179.129464,0 176.785714,2.34375 176.785714,5.35714286 L176.785714,42.8571429 L235.714286,42.8571429 L235.714286,5.35714286 Z"></path>
              </g>
            </svg>
          </a>
          <a (click)="addToList({symbol: stock?.symbol, listName: 'Holding'})">
            <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
                 xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_portfolio" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M107.142857,64 L192.857143,64 L192.857143,42.5 L107.142857,42.5 L107.142857,64 Z M300,171.5 L300,252.125 C300,266.90625 287.946429,279 273.214286,279 L26.7857143,279 C12.0535714,279 0,266.90625 0,252.125 L0,171.5 L112.5,171.5 L112.5,198.375 C112.5,204.253906 117.354911,209.125 123.214286,209.125 L176.785714,209.125 C182.645089,209.125 187.5,204.253906 187.5,198.375 L187.5,171.5 L300,171.5 Z M171.428571,171.5 L171.428571,193 L128.571429,193 L128.571429,171.5 L171.428571,171.5 Z M300,90.875 L300,155.375 L0,155.375 L0,90.875 C0,76.09375 12.0535714,64 26.7857143,64 L85.7142857,64 L85.7142857,37.125 C85.7142857,28.2226562 92.9129464,21 101.785714,21 L198.214286,21 C207.087054,21 214.285714,28.2226562 214.285714,37.125 L214.285714,64 L273.214286,64 C287.946429,64 300,76.09375 300,90.875 Z"></path>
              </g>
            </svg>
          </a>
        </div>
        <div class="base-stock__PGR">
          <img src="{{ appendPGRImage(stock ? stock['PGR'] : null) }}">
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

  // public addToList(val: AddListConfig) {
  //   this.addToListClicked.emit(val);
  // }

  public viewStockReport(symbol: string) {
    this.viewStockReportClicked.emit(symbol);
  }

}
