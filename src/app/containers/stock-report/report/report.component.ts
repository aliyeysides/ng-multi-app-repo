import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-report',
  template: `
    <div [ngBusy]="loading">
      <iframe #iframe class="stock-view__iframe" id="iframeId" [src]="sanitizedSrc" (load)="sanitizedSrc ? onLoad() : null"></iframe>
    </div>
  `,
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  public symbol: string;
  public src: string;
  public sanitizedSrc: SafeUrl;
  public loading: Subscription;

  apiHostName = environment.envProtocol + '://' + environment.envHostName;

  constructor(private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private location: Location) {
  }

  ngOnInit() {
    this.loading = this.route.params
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
    console.log('loaded');
    this.loading.unsubscribe();
  }


}
