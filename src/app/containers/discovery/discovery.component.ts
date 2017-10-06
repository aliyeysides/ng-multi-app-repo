import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Location} from '@angular/common';
import {DiscoveryService} from '../../core/services/discovery.service';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Router} from '@angular/router';
import {Idea} from '../../shared/models/idea';

@Component({
  selector: 'cpt-discovery',
  template: `
    <div class="discovery__container">
      <div class="body__top">
        <div class="section-header">
          <h1>Discovery results for</h1>
          <div class="section-header__search">
            <cpt-symbol-search></cpt-symbol-search>
          </div>
          <div class="section-header__actions">
            <a (click)="goBack()"><i class="fa fa-reply" aria-hidden="true"></i> <span>Back</span></a> 
          </div>
          <div class="section-header__actions">
            <a>
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <defs></defs>
                  <g id="icon_stockview" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                      <path d="M254.553042,183.258345 C258.079449,183.258345 260.938156,186.117061 260.938156,189.64348 L260.938156,278.615777 C260.938156,282.142196 258.079449,285.000912 254.553042,285.000912 L21.3851136,285.000912 C17.8605309,285.000912 15,282.142196 15,278.615777 L15,45.4452365 C15,41.9188176 17.8605309,39.0601014 21.3851136,39.0601014 L110.358935,39.0601014 C113.885342,39.0601014 116.744048,41.9188176 116.744048,45.4452365 L116.744048,69.9915203 C116.744048,73.5179392 113.885342,76.3766554 110.358935,76.3766554 L52.316428,76.3766554 L52.316428,247.682534 L223.623552,247.682534 L223.623552,189.64348 C223.623552,186.117061 226.482259,183.258345 230.008666,183.258345 L254.553042,183.258345 Z M278.614886,15 C282.141293,15 285,17.8587162 285,21.3851351 L285,149.627838 C285,153.154257 282.141293,156.012973 278.614886,156.012973 L254.553954,156.012973 C251.027547,156.012973 248.168841,153.154257 248.168841,149.627838 L248.168841,77.8753378 L159.497856,166.544797 C158.301104,167.741554 156.677461,168.41473 154.982669,168.41473 L137.969078,168.41473 C134.444495,168.41473 131.583964,165.556014 131.583964,162.029595 L131.583964,145.01777 C131.583964,143.322973 132.257138,141.699324 133.455715,140.500743 L222.124875,51.8312838 L150.370793,51.8312838 C146.84621,51.8312838 143.985679,48.9725676 143.985679,45.4461486 L143.985679,21.3851351 C143.985679,17.8587162 146.84621,15 150.370793,15 L278.614886,15 Z" id="icon"></path>
                  </g>
              </svg>
              <span>View</span>
            </a>
            <a>
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="icon_watching" stroke="none" stroke-width="1" fill="#1199ff" fill-rule="evenodd">
                    <path d="M117.857143,53.5714286 L46.875,53.5714286 C44.53125,53.5714286 42.3549107,55.078125 41.6852679,57.421875 L0,203.571429 L0,289.285714 C0,295.145089 4.85491071,300 10.7142857,300 L96.4285714,300 C102.287946,300 107.142857,295.145089 107.142857,289.285714 L107.142857,192.857143 C113.002232,192.857143 117.857143,188.002232 117.857143,182.142857 L117.857143,53.5714286 Z M171.428571,53.5714286 L128.571429,53.5714286 L128.571429,171.428571 L171.428571,171.428571 L171.428571,53.5714286 Z M300,203.571429 L258.314732,57.421875 C257.645089,55.078125 255.46875,53.5714286 253.125,53.5714286 L182.142857,53.5714286 L182.142857,182.142857 C182.142857,188.002232 186.997768,192.857143 192.857143,192.857143 L192.857143,289.285714 C192.857143,295.145089 197.712054,300 203.571429,300 L289.285714,300 C295.145089,300 300,295.145089 300,289.285714 L300,203.571429 Z M123.214286,5.35714286 C123.214286,2.34375 120.870536,0 117.857143,0 L69.6428571,0 C66.6294643,0 64.2857143,2.34375 64.2857143,5.35714286 L64.2857143,42.8571429 L123.214286,42.8571429 L123.214286,5.35714286 Z M235.714286,5.35714286 C235.714286,2.34375 233.370536,0 230.357143,0 L182.142857,0 C179.129464,0 176.785714,2.34375 176.785714,5.35714286 L176.785714,42.8571429 L235.714286,42.8571429 L235.714286,5.35714286 Z"></path>
                </g>
              </svg>
              <span>Watch</span>
            </a>
            <a>
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                  <defs></defs>
                  <g id="icon_portfolio" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                      <path d="M107.142857,64 L192.857143,64 L192.857143,42.5 L107.142857,42.5 L107.142857,64 Z M300,171.5 L300,252.125 C300,266.90625 287.946429,279 273.214286,279 L26.7857143,279 C12.0535714,279 0,266.90625 0,252.125 L0,171.5 L112.5,171.5 L112.5,198.375 C112.5,204.253906 117.354911,209.125 123.214286,209.125 L176.785714,209.125 C182.645089,209.125 187.5,204.253906 187.5,198.375 L187.5,171.5 L300,171.5 Z M171.428571,171.5 L171.428571,193 L128.571429,193 L128.571429,171.5 L171.428571,171.5 Z M300,90.875 L300,155.375 L0,155.375 L0,90.875 C0,76.09375 12.0535714,64 26.7857143,64 L85.7142857,64 L85.7142857,37.125 C85.7142857,28.2226562 92.9129464,21 101.785714,21 L198.214286,21 C207.087054,21 214.285714,28.2226562 214.285714,37.125 L214.285714,64 L273.214286,64 C287.946429,64 300,76.09375 300,90.875 Z"></path>
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
          (viewStockDiscoveryClicked)="viewStockDiscovery($event)"
          [results]="results"></cpt-discovery-results>
      </div>
    </div>
  `,
  styleUrls: ['./discovery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiscoveryComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public metaInfo: Idea;
  public results: object[];

  constructor(private router: Router,
              private discoveryService: DiscoveryService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params
      .map(params => params.symbol)
      .switchMap(val => this.discoveryService.getDiscoveryResultLists(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        this.parseDiscoveryResponse(res);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public viewStockReport(ticker: string) {
    this.router.navigate(['/report', ticker]);
  }

  public viewStockDiscovery(ticker: string) {
    this.router.navigate(['/discovery', ticker]);
  }

  // public addToList(params: AddListConfig) {
  //  TODO: implement app add to list service
  // }

  private parseDiscoveryResponse(res: object) {
    this.metaInfo = res['metainfo'] as Idea;
    this.results = res['results'];
  }

  goBack() {
    this.location.back();
  }

}
