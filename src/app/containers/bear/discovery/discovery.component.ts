import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {DiscoveryService} from '../../../core/services/discovery.service';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {Idea} from '../../../shared/models/idea';
import {Subscription} from 'rxjs/Subscription';
import {IdeasService} from '../../../core/services/ideas.service';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'cpt-discovery',
  template: `
    <div class="discovery__container" [ngBusy]="loading">
      <div class="body__top">
        <div class="section-header">
          <h1>Discover stocks like</h1>
          <div class="section-header__search">
            <cpt-bear-symbol-search [placeholder]="metaInfo?.symbol.toUpperCase()"></cpt-bear-symbol-search>
          </div>
          <div class="section-header__actions">
            <a (click)="viewStockReport(metaInfo.symbol)">
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <defs></defs>
                  <g id="icon_stockview" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                      <path d="M254.553042,183.258345 C258.079449,183.258345 260.938156,186.117061 260.938156,189.64348 L260.938156,278.615777 C260.938156,282.142196 258.079449,285.000912 254.553042,285.000912 L21.3851136,285.000912 C17.8605309,285.000912 15,282.142196 15,278.615777 L15,45.4452365 C15,41.9188176 17.8605309,39.0601014 21.3851136,39.0601014 L110.358935,39.0601014 C113.885342,39.0601014 116.744048,41.9188176 116.744048,45.4452365 L116.744048,69.9915203 C116.744048,73.5179392 113.885342,76.3766554 110.358935,76.3766554 L52.316428,76.3766554 L52.316428,247.682534 L223.623552,247.682534 L223.623552,189.64348 C223.623552,186.117061 226.482259,183.258345 230.008666,183.258345 L254.553042,183.258345 Z M278.614886,15 C282.141293,15 285,17.8587162 285,21.3851351 L285,149.627838 C285,153.154257 282.141293,156.012973 278.614886,156.012973 L254.553954,156.012973 C251.027547,156.012973 248.168841,153.154257 248.168841,149.627838 L248.168841,77.8753378 L159.497856,166.544797 C158.301104,167.741554 156.677461,168.41473 154.982669,168.41473 L137.969078,168.41473 C134.444495,168.41473 131.583964,165.556014 131.583964,162.029595 L131.583964,145.01777 C131.583964,143.322973 132.257138,141.699324 133.455715,140.500743 L222.124875,51.8312838 L150.370793,51.8312838 C146.84621,51.8312838 143.985679,48.9725676 143.985679,45.4461486 L143.985679,21.3851351 C143.985679,17.8587162 146.84621,15 150.370793,15 L278.614886,15 Z" id="icon"></path>
                  </g>
              </svg>
              <span>View</span>
            </a>
            <a (click)="addToList({ list: watchingListId, symbol: metaInfo.symbol })">
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="icon_watching--PLUS" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M213.966667,211.966667 L181,211.966667 L181,232.033333 L213.966667,232.033333 L213.966667,265 L234.033333,265 L234.033333,232.033333 L267,232.033333 L267,211.966667 L234.033333,211.966667 L234.033333,179 L213.966667,179 L213.966667,211.966667 Z M171.428571,154.68002 C165.189102,159.477775 159.630502,165.11725 154.922645,171.428571 L128.571429,171.428571 L128.571429,53.5714286 L171.428571,53.5714286 L171.428571,154.68002 Z M300,260.725666 L300,289.285714 C300,295.145089 295.145089,300 289.285714,300 L259.659152,300 C277.129395,291.834943 291.383287,277.936554 300.000007,260.725653 Z M182.142857,147.649982 L182.142857,53.5714286 L253.125,53.5714286 C255.46875,53.5714286 257.645089,55.078125 258.314732,57.421875 L290.107658,168.888637 C274.43528,149.441678 250.420595,137 223.5,137 C208.498306,137 194.399,140.863583 182.14284,147.649992 Z M117.857143,53.5714286 L117.857143,182.142857 C117.857143,188.002232 113.002232,192.857143 107.142857,192.857143 L107.142857,289.285714 C107.142857,295.145089 102.287946,300 96.4285714,300 L10.7142857,300 C4.85491071,300 0,295.145089 0,289.285714 L0,203.571429 L41.6852679,57.421875 C42.3549107,55.078125 44.53125,53.5714286 46.875,53.5714286 L117.857143,53.5714286 Z M123.214286,5.35714286 L123.214286,42.8571429 L64.2857143,42.8571429 L64.2857143,5.35714286 C64.2857143,2.34375 66.6294643,0 69.6428571,0 L117.857143,0 C120.870536,0 123.214286,2.34375 123.214286,5.35714286 Z M235.714286,5.35714286 L235.714286,42.8571429 L176.785714,42.8571429 L176.785714,5.35714286 C176.785714,2.34375 179.129464,0 182.142857,0 L230.357143,0 C233.370536,0 235.714286,2.34375 235.714286,5.35714286 Z M223.5,300 C181.250217,300 147,265.749783 147,223.5 C147,181.250217 181.250217,147 223.5,147 C265.749783,147 300,181.250217 300,223.5 C300,265.749783 265.749783,300 223.5,300 Z" id="Combined-Shape"></path>
                </g>
              </svg>
              <span>Watch</span>
            </a>
            <a (click)="addToList({ list: holdingListId, symbol: metaInfo.symbol })">
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="icon_holding--PLUS" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M213.966667,212.966667 L181,212.966667 L181,233.033333 L213.966667,233.033333 L213.966667,266 L234.033333,266 L234.033333,233.033333 L267,233.033333 L267,212.966667 L234.033333,212.966667 L234.033333,180 L213.966667,180 L213.966667,212.966667 Z M300.000007,185.274347 C297.559,180.398718 294.6656,175.788924 291.374844,171.5 L300,171.5 L300,185.274334 Z M158.459408,279 L26.7857143,279 C12.0535714,279 0,266.90625 0,252.125 L0,171.5 L112.5,171.5 L112.5,198.375 C112.5,204.253906 117.354911,209.125 123.214286,209.125 L139.203224,209.125 C138.411994,213.798601 138,218.601187 138,223.5 C138,244.681735 145.702518,264.06445 158.459408,279 Z M143.600382,193 L128.571429,193 L128.571429,171.5 L155.625156,171.5 C150.642052,177.994603 146.570096,185.224969 143.600388,192.999999 Z M275.17234,155.375 C260.819295,144.471456 242.915393,138 223.5,138 C204.084607,138 186.180705,144.471456 171.82766,155.375 L0,155.375 L0,90.875 C0,76.09375 12.0535714,64 26.7857143,64 L85.7142857,64 L85.7142857,37.125 C85.7142857,28.2226562 92.9129464,21 101.785714,21 L198.214286,21 C207.087054,21 214.285714,28.2226562 214.285714,37.125 L214.285714,64 L273.214286,64 C287.946429,64 300,76.09375 300,90.875 L300,155.375 L275.17234,155.375 Z M107.142857,64 L192.857143,64 L192.857143,42.5 L107.142857,42.5 L107.142857,64 Z M223.5,300 C181.250217,300 147,265.749783 147,223.5 C147,181.250217 181.250217,147 223.5,147 C265.749783,147 300,181.250217 300,223.5 C300,265.749783 265.749783,300 223.5,300 Z" id="Combined-Shape"></path>
                </g>
              </svg>
              <span>Hold</span>
            </a>
          </div>
        </div>
        <div class="discovery-seed__container">
          <cpt-discovery-seed
            (viewStockReportClicked)="viewStockReport($event)"
            [metaInfo]="metaInfo"></cpt-discovery-seed>
        </div>
      </div>
      <div class="body__bottom"> 
        <cpt-discovery-results
          (viewStockReportClicked)="viewStockReport($event)"
          (viewDiscoveryClicked)="viewStockDiscovery($event)"
          (addToListClicked)="addToList($event)"
          [results]="results"></cpt-discovery-results>
      </div>
    </div>
  `,
  styleUrls: ['./discovery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoveryComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;

  public metaInfo: Idea;
  public results: object[];
  public loading: Subscription;
  public holdingListId: string;
  public watchingListId: string;

  constructor(private router: Router,
              private authService: AuthService,
              private ideasService: IdeasService,
              private discoveryService: DiscoveryService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.updateData();
    this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .subscribe(res => {
        this.holdingListId = res[2]['user_lists'][0]['list_id'];
        this.watchingListId = res[2]['user_lists'][1]['list_id'];
      });

    setInterval(() => {
      this.updateData();
    }, 1000 * 60)
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public updateData() {
    window.scrollTo(0,0);
    this.route.params
      .map(params => params.symbol)
      .switchMap(val => this.discoveryService.getDiscoveryResultLists(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.parseDiscoveryResponse(res);
      })
  }

  public viewStockReport(ticker: string) {
    this.router.navigate(['/report', ticker]);
  }

  public viewStockDiscovery(ticker: string) {
    this.updateData();
    this.router.navigate(['/discovery', ticker]);
  }

  private parseDiscoveryResponse(res: object) {
    this.metaInfo = res['metainfo'] as Idea;
    this.results = res['results'];
  }

  goBack() {
    this.location.back();
  }

  addToList(params) {
    if (params.list === 'Holding') params.list = this.holdingListId;
    if (params.list === 'Watching') params.list = this.watchingListId;
    this.loading = this.ideasService.addStockIntoList(params.list.toString(), params.symbol)
      .take(1)
      .subscribe()
  }

}
