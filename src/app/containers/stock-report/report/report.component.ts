import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'cpt-report',
  template: `
    <div class="stock-view__container container-fluid">
      <div class="row--header header text-center row no-gutters">
        <h1 class="col-3"><a (click)="goBack()" class="back"><i class="fa fa-reply" aria-hidden="true"></i></a> Stock
          Report for</h1>
        <cpt-symbol-search class="col-6"></cpt-symbol-search>
      </div>
      <iframe #iframe class="stock-view__iframe" id="iframeId" [src]="sanitizedSrc" (load)="onLoad()"></iframe>
    </div>
  `,
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  public symbol: string;
  public src: string;
  public sanitizedSrc: SafeUrl;

  apiHostName = environment.envProtocol + '://' + environment.envHostName;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
          if (params.symbol) {
            this.symbol = params.symbol;
          } else {
            this.symbol = 'AAPL';
          }
          this.src = `${this.apiHostName}/CPTRestSecure/StockSummary/index.html?lang=English&uid=9582&environment=desktop&subEnvironment=chaikinAnalytics&version=1.3.2&symbol=${this.symbol}&userType=CAUser`;
          this.sanitizedSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
        }
      );
  }

  goBack() {
    this.location.back();
  }

  onLoad() {
    const iframe = this.iframe.nativeElement;
    const doc = iframe.contentDocument || (<HTMLIFrameElement>iframe).contentWindow;
    doc.rowSummaryDate.style.marginTop = '10px';
  }


}
