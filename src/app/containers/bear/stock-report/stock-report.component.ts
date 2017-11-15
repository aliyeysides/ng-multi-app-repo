import {Component, OnChanges, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {environment} from '../../../../environments/environment';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/services/auth.service';
import {IdeasService} from '../../../core/services/ideas.service';

@Component({
  selector: 'cpt-stock-report',
  template: `
    <div class="stock-view__container">
      <div class="body__top">
        <div class="section-header">
          <h1>Stock view for</h1>
          <div class="section-header__search">
            <cpt-symbol-search [placeholder]="symbol.toUpperCase()"></cpt-symbol-search>
          </div>
          <div class="section-header__actions">
            <a (click)="gotoDiscovery(symbol)" class="discovery-icon">
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg"
                   xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="icon_discovery" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path
                    d="M239.536278,168.657105 C229.637797,170.997635 220.433142,177.351517 214.87514,186.548489 C209.317138,195.912031 208.27566,206.613832 211.053921,216.311939 L177.711826,234.705882 C172.326911,229.35427 165.206692,225.508911 157.391167,224.002658 L157.391167,187.552183 C157.73882,187.384189 158.084993,187.384189 158.432645,187.217619 L158.607211,187.217619 C158.780298,187.217619 158.954864,187.217619 159.12795,187.049624 L159.648689,187.049624 L159.994863,186.883054 C160.170908,186.883054 160.517081,186.71506 160.690168,186.71506 L160.864734,186.71506 C163.295342,185.880783 165.900517,184.877089 168.159519,183.706824 L168.332605,183.537406 C168.507171,183.537406 168.680258,183.370836 168.851865,183.370836 C171.458519,181.866006 174.063694,180.194606 176.321216,178.020647 L176.841955,177.519512 L177.188128,177.184947 L177.535781,177.016953 C179.621696,174.842994 181.531566,172.335894 183.268349,169.82737 L183.441436,169.492805 L183.616001,169.159664 C185.003653,166.817711 186.219697,164.142616 187.261175,161.299528 L187.261175,161.132957 C187.261175,160.964963 187.435741,160.798392 187.435741,160.465251 L187.435741,160.295833 L187.607348,159.796122 C187.607348,159.628128 187.783393,159.461557 187.783393,159.293563 L187.783393,159.125569 C188.477219,156.450474 188.824872,153.607386 188.997958,150.932291 L188.997958,150.764297 L188.997958,150.264585 C188.997958,147.254926 188.651785,144.243843 187.783393,141.235608 L187.783393,141.067614 C187.783393,140.901043 187.783393,140.733049 187.607348,140.398484 L187.607348,140.231914 L187.607348,140.06392 L187.435741,139.729355 C187.435741,139.39479 187.261175,139.229643 187.261175,139.060225 L187.261175,138.895078 C187.088088,138.557666 187.088088,138.392519 186.915002,138.057955 L219.737837,120 C225.119794,125.68333 232.066926,129.698107 239.536278,131.537501 L239.536278,168.657105 Z M149.692987,111.718611 L149.172877,111.718611 C146.050743,111.718611 142.928608,112.052754 139.980828,112.719617 L139.459241,112.888821 L139.112009,112.888821 C138.939132,113.05376 138.593377,113.05376 138.417545,113.05376 L138.246145,113.222964 C135.296887,113.889827 132.520507,115.060037 129.918482,116.395186 L129.745605,116.561546 C129.572728,116.561546 129.398373,116.729329 129.225495,116.895689 C126.62347,118.230837 124.1958,120.067911 121.941007,122.072766 C121.593775,122.240549 121.41942,122.405487 121.246543,122.573269 L121.072188,122.741052 L120.726433,123.075194 C120.553556,123.241555 120.379201,123.409337 120.206324,123.575697 L120.031969,123.743479 C119.859091,124.077622 119.684737,124.242561 119.337504,124.411765 L86.7287066,106.376595 C89.1578545,98.8590977 89.3307318,91.0117231 87.0759388,83.8297899 L120.379201,65.2941176 C127.663689,72.4746289 137.724558,76.9834213 149,76.9834213 C160.09961,76.9834213 170.334833,72.4746289 177.447922,65.2941176 L210.749706,83.8297899 C208.667791,91.0117231 208.667791,98.8590977 211.271293,106.376595 L178.486663,124.411765 C178.313786,124.242561 178.139431,124.077622 177.966554,123.90984 L177.792199,123.743479 C177.792199,123.575697 177.619321,123.409337 177.447922,123.409337 L177.100689,122.907412 L176.924857,122.907412 C174.498664,120.402053 171.722284,118.39862 168.773027,116.729329 C168.598672,116.729329 168.254395,116.561546 168.08004,116.561546 L168.08004,116.395186 C165.305138,115.060037 162.528758,113.889827 159.580978,113.222964 L159.580978,113.05376 C159.406623,113.05376 159.060868,113.05376 158.886513,112.888821 L158.366404,112.888821 L158.020649,112.719617 C155.244269,112.220536 152.642244,111.886394 149.867342,111.718611 L149.692987,111.718611 Z M140.608833,224.002658 C132.636876,225.508911 125.704226,229.35427 120.159287,234.705882 L86.8852249,216.311939 C89.8304201,206.613832 88.7911131,195.912031 83.0719722,186.548489 C77.5270333,177.351517 68.5157695,170.997635 58.4637224,168.657105 L58.4637224,131.537501 C66.0887515,129.698107 73.0199251,125.68333 78.3936146,120 L110.973821,138.057955 C110.973821,138.392519 110.973821,138.557666 110.801096,138.895078 L110.801096,139.060225 C110.626894,139.229643 110.626894,139.39479 110.626894,139.729355 L110.454168,140.06392 L110.454168,140.231914 L110.281442,140.398484 C109.58611,143.409567 109.242135,146.249808 109.067933,149.092897 L109.067933,149.427462 L109.067933,149.762026 L109.067933,149.930021 C109.067933,153.107674 109.414861,156.450474 110.281442,159.796122 L110.454168,160.129263 L110.626894,160.465251 C110.626894,160.630398 110.626894,160.964963 110.801096,161.299528 C111.667677,163.808051 112.706984,166.148581 113.920493,168.490534 C114.094695,168.825099 114.26742,168.99167 114.440146,169.159664 L114.612872,169.660799 L114.787074,169.82737 C116.173309,172.002752 117.733745,174.173864 119.639634,176.182676 L119.812359,176.182676 C119.986561,176.347823 120.159287,176.517241 120.333489,176.682388 C122.931757,179.357482 125.878428,181.531441 129.170551,183.370836 L129.344753,183.370836 L129.344753,183.537406 L129.864406,183.706824 C130.037132,183.873395 130.212811,183.873395 130.38406,184.039965 L130.558262,184.039965 C132.289948,185.04366 134.195836,185.711365 136.104677,186.380495 L136.275927,186.380495 C136.450129,186.548489 136.797056,186.548489 136.969782,186.71506 L137.143984,186.71506 C137.31671,186.71506 137.662161,186.71506 137.836363,186.883054 C138.702945,187.049624 139.569526,187.384189 140.608833,187.552183 L140.608833,224.002658 Z M269.154957,172.651429 C264.808443,170.301429 260.288661,168.792857 255.76888,167.952857 L255.76888,132.047143 C260.288661,131.208571 264.808443,129.697143 269.154957,127.348571 C288.104868,116.778571 294.711272,93.2885714 283.583605,75 C272.632168,56.5442857 248.294653,50.3357143 229.343262,60.9071429 C224.996748,63.2557143 221.521018,66.2757143 218.566573,69.8 L186.229104,51.6771429 C187.792961,47.4828571 188.837013,42.9528571 188.837013,38.2557143 C188.837013,17.1142857 170.932635,0 149.026798,0 C126.947694,0 109.215103,17.1142857 109.215103,38.2557143 C109.215103,42.9528571 110.084406,47.4828571 111.649743,51.6771429 L79.487023,69.8 C76.5310975,66.2757143 72.8806185,63.2557143 68.7088539,60.9071429 C49.5856749,50.3357143 25.2466796,56.5442857 14.2937614,75 C3.34232418,93.2885714 9.94724778,116.778571 28.8971586,127.348571 C33.0689232,129.697143 37.5901859,131.208571 42.1099677,132.047143 L42.1099677,167.952857 C37.5901859,168.792857 33.0689232,170.301429 28.8971586,172.651429 C9.94724778,183.221429 3.34232418,206.711429 14.2937614,225 C25.2466796,243.288571 49.5856749,249.665714 68.7088539,239.094286 C72.8806185,236.744286 76.5310975,233.724286 79.487023,230.201429 L111.649743,248.154286 C110.084406,252.348571 109.215103,256.878571 109.215103,261.745714 C109.215103,282.885714 126.947694,300 149.026798,300 C170.932635,300 188.837013,282.885714 188.837013,261.745714 C188.837013,256.878571 187.792961,252.348571 186.229104,248.154286 L218.566573,230.201429 C221.521018,233.724286 224.996748,236.744286 229.343262,239.094286 C248.294653,249.665714 272.632168,243.288571 283.583605,225 C294.711272,206.711429 288.104868,183.221429 269.154957,172.651429 L269.154957,172.651429 Z"></path>
                </g>
              </svg>
              <span>Discover</span>
            </a>
            <a (click)="addToList(watchingListId, symbol)">
              <svg width="300px" height="300px" viewBox="0 0 300 300" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <defs></defs>
                <g id="icon_watching--PLUS" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M213.966667,211.966667 L181,211.966667 L181,232.033333 L213.966667,232.033333 L213.966667,265 L234.033333,265 L234.033333,232.033333 L267,232.033333 L267,211.966667 L234.033333,211.966667 L234.033333,179 L213.966667,179 L213.966667,211.966667 Z M171.428571,154.68002 C165.189102,159.477775 159.630502,165.11725 154.922645,171.428571 L128.571429,171.428571 L128.571429,53.5714286 L171.428571,53.5714286 L171.428571,154.68002 Z M300,260.725666 L300,289.285714 C300,295.145089 295.145089,300 289.285714,300 L259.659152,300 C277.129395,291.834943 291.383287,277.936554 300.000007,260.725653 Z M182.142857,147.649982 L182.142857,53.5714286 L253.125,53.5714286 C255.46875,53.5714286 257.645089,55.078125 258.314732,57.421875 L290.107658,168.888637 C274.43528,149.441678 250.420595,137 223.5,137 C208.498306,137 194.399,140.863583 182.14284,147.649992 Z M117.857143,53.5714286 L117.857143,182.142857 C117.857143,188.002232 113.002232,192.857143 107.142857,192.857143 L107.142857,289.285714 C107.142857,295.145089 102.287946,300 96.4285714,300 L10.7142857,300 C4.85491071,300 0,295.145089 0,289.285714 L0,203.571429 L41.6852679,57.421875 C42.3549107,55.078125 44.53125,53.5714286 46.875,53.5714286 L117.857143,53.5714286 Z M123.214286,5.35714286 L123.214286,42.8571429 L64.2857143,42.8571429 L64.2857143,5.35714286 C64.2857143,2.34375 66.6294643,0 69.6428571,0 L117.857143,0 C120.870536,0 123.214286,2.34375 123.214286,5.35714286 Z M235.714286,5.35714286 L235.714286,42.8571429 L176.785714,42.8571429 L176.785714,5.35714286 C176.785714,2.34375 179.129464,0 182.142857,0 L230.357143,0 C233.370536,0 235.714286,2.34375 235.714286,5.35714286 Z M223.5,300 C181.250217,300 147,265.749783 147,223.5 C147,181.250217 181.250217,147 223.5,147 C265.749783,147 300,181.250217 300,223.5 C300,265.749783 265.749783,300 223.5,300 Z" id="Combined-Shape"></path>
                </g>
              </svg>
              <span>Watch</span>
            </a>
            <a (click)="addToList(holdingListId, symbol)">
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
      </div>
      <div class="body__bottom" [ngBusy]="loading">
        <cpt-report [src]="sanitizedSrc" (loadFinished)="loadFinished()"></cpt-report>
      </div>
    </div>
  `,
  styleUrls: ['./stock-report.component.scss'],
})
export class StockReportComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;

  public symbol: string;
  public src: string;
  public sanitizedSrc: SafeUrl;
  public loading: Subscription;

  public holdingListId: string;
  public watchingListId: string;

  apiHostName = environment.envProtocol + '://' + environment.envHostName;

  constructor(private location: Location,
              private router: Router,
              private authService: AuthService,
              private ideasService: IdeasService,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer) {
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
  }

  updateData() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
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

  gotoDiscovery(symbol: string) {
    this.router.navigate(['/discovery', symbol]);
  }

  loadFinished() {
    // this.loading.unsubscribe();
  }

  addToList(listId: string, symbol: string) {
    this.loading = this.ideasService.addStockIntoList(listId.toString(), symbol)
      .take(1)
      .subscribe()
  }

}