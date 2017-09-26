import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'cpt-report',
  template: `
    <div class="stock-view__container container">
      <div class="row--header header text-center row no-gutters">
        <h1 class="col-12"><a (click)="goBack()" class="back"><i class="fa fa-reply" aria-hidden="true"></i></a> Stock
          Report for</h1>
      </div>
      <iframe class="stock-view__iframe" id="iframeId" [src]="sanitizedSrc"></iframe>
    </div>
  `,
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
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


}
