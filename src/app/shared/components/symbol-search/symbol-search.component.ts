import {
  AfterContentInit,
  AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SymbolSearchService} from '../../../core/services/symbol-search.service';
import {IdeasService} from '../../../core/services/ideas.service';
import {AuthService} from '../../../core/services/auth.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'cpt-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit()">
      <div class="form-group">
        <input #search (focusout)="toggleFocus()" (focus)="toggleFocus()" [formControl]="symbolSearchForm" type="search"
               class="form-control search-box"
               placeholder="{{ placeholder }}"
               aria-describedby="basic-addon1">
        <button type="submit"><i class="fa fa-search" aria-hidden="true"></i></button>
      </div>
    </form>
    <div (mousedown)="$event.preventDefault();" *ngIf="searchResults && symbolSearchForm.value && focus == true"
         class="search__dropdown">
      <ul [ngBusy]="loading" *ngFor="let result of searchResults" class="container">
        <li (click)="onClick(result.Symbol)" class="row search__entry">
          <div class="col-3 search__company">
            <p class="company-ticker">
              {{ result.Symbol }}
            </p>
          </div>
          <div class="col-7">
            <p class="company-name">
              {{ result.CompanyName }}
            </p>
          </div>
          <div (click)="addToList(holdingListId, result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_holding--PLUS" fill="#1199ff" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M213.966667,212.966667 L181,212.966667 L181,233.033333 L213.966667,233.033333 L213.966667,266 L234.033333,266 L234.033333,233.033333 L267,233.033333 L267,212.966667 L234.033333,212.966667 L234.033333,180 L213.966667,180 L213.966667,212.966667 Z M300.000007,185.274347 C297.559,180.398718 294.6656,175.788924 291.374844,171.5 L300,171.5 L300,185.274334 Z M158.459408,279 L26.7857143,279 C12.0535714,279 0,266.90625 0,252.125 L0,171.5 L112.5,171.5 L112.5,198.375 C112.5,204.253906 117.354911,209.125 123.214286,209.125 L139.203224,209.125 C138.411994,213.798601 138,218.601187 138,223.5 C138,244.681735 145.702518,264.06445 158.459408,279 Z M143.600382,193 L128.571429,193 L128.571429,171.5 L155.625156,171.5 C150.642052,177.994603 146.570096,185.224969 143.600388,192.999999 Z M275.17234,155.375 C260.819295,144.471456 242.915393,138 223.5,138 C204.084607,138 186.180705,144.471456 171.82766,155.375 L0,155.375 L0,90.875 C0,76.09375 12.0535714,64 26.7857143,64 L85.7142857,64 L85.7142857,37.125 C85.7142857,28.2226562 92.9129464,21 101.785714,21 L198.214286,21 C207.087054,21 214.285714,28.2226562 214.285714,37.125 L214.285714,64 L273.214286,64 C287.946429,64 300,76.09375 300,90.875 L300,155.375 L275.17234,155.375 Z M107.142857,64 L192.857143,64 L192.857143,42.5 L107.142857,42.5 L107.142857,64 Z M223.5,300 C181.250217,300 147,265.749783 147,223.5 C147,181.250217 181.250217,147 223.5,147 C265.749783,147 300,181.250217 300,223.5 C300,265.749783 265.749783,300 223.5,300 Z"
                  id="Combined-Shape"></path>
              </g>
            </svg>
          </div>
          <div (click)="addToList(watchingListId, result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_watching--PLUS" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M213.966667,211.966667 L181,211.966667 L181,232.033333 L213.966667,232.033333 L213.966667,265 L234.033333,265 L234.033333,232.033333 L267,232.033333 L267,211.966667 L234.033333,211.966667 L234.033333,179 L213.966667,179 L213.966667,211.966667 Z M171.428571,154.68002 C165.189102,159.477775 159.630502,165.11725 154.922645,171.428571 L128.571429,171.428571 L128.571429,53.5714286 L171.428571,53.5714286 L171.428571,154.68002 Z M300,260.725666 L300,289.285714 C300,295.145089 295.145089,300 289.285714,300 L259.659152,300 C277.129395,291.834943 291.383287,277.936554 300.000007,260.725653 Z M182.142857,147.649982 L182.142857,53.5714286 L253.125,53.5714286 C255.46875,53.5714286 257.645089,55.078125 258.314732,57.421875 L290.107658,168.888637 C274.43528,149.441678 250.420595,137 223.5,137 C208.498306,137 194.399,140.863583 182.14284,147.649992 Z M117.857143,53.5714286 L117.857143,182.142857 C117.857143,188.002232 113.002232,192.857143 107.142857,192.857143 L107.142857,289.285714 C107.142857,295.145089 102.287946,300 96.4285714,300 L10.7142857,300 C4.85491071,300 0,295.145089 0,289.285714 L0,203.571429 L41.6852679,57.421875 C42.3549107,55.078125 44.53125,53.5714286 46.875,53.5714286 L117.857143,53.5714286 Z M123.214286,5.35714286 L123.214286,42.8571429 L64.2857143,42.8571429 L64.2857143,5.35714286 C64.2857143,2.34375 66.6294643,0 69.6428571,0 L117.857143,0 C120.870536,0 123.214286,2.34375 123.214286,5.35714286 Z M235.714286,5.35714286 L235.714286,42.8571429 L176.785714,42.8571429 L176.785714,5.35714286 C176.785714,2.34375 179.129464,0 182.142857,0 L230.357143,0 C233.370536,0 235.714286,2.34375 235.714286,5.35714286 Z M223.5,300 C181.250217,300 147,265.749783 147,223.5 C147,181.250217 181.250217,147 223.5,147 C265.749783,147 300,181.250217 300,223.5 C300,265.749783 265.749783,300 223.5,300 Z"
                  id="Combined-Shape"></path>
              </g>
            </svg>
          </div>
        </li>
      </ul>
      <ul *ngIf="searchResults && symbolSearchForm.value && searchResults.length == 0">
        <li>
          <p class="search__none">Symbol not found</p>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SymbolSearchComponent implements AfterContentInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @ViewChild('search') search: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private uid: string;
  private navEndLocation: string;

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public focus: boolean = false;
  public holdingListId: string;
  public watchingListId: string;

  public loading: Subscription;

  constructor(private router: Router,
              private authService: AuthService,
              private ideasService: IdeasService,
              private symbolSearchService: SymbolSearchService) {
    this.symbolSearchForm = new FormControl();

    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => this.navEndLocation = router.routerState.root.firstChild.component['name']);
  }

  ngAfterContentInit() {
    // this.search.nativeElement.focus();
    this.authService.currentUser$
      .takeUntil(this.ngUnsubscribe)
      .map(usr => this.uid = usr['UID'])
      .filter(x => x != undefined)
      .flatMap(uid => this.ideasService.getIdeasList(uid, 'Bear'))
      .subscribe(res => {
        this.holdingListId = res[2]['user_lists'][0]['list_id'];
        this.watchingListId = res[2]['user_lists'][1]['list_id'];
      });

    this.searchResults = [];
    this.symbolSearchForm.valueChanges
      .debounceTime(500)
      .switchMap(val => this.symbolSearchService.symbolLookup(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.searchResults = val;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  gotoReport(symbol: string) {
    this.symbolSearchForm.reset();
    this.router.navigate(['/report', symbol]);
  }

  gotoDiscovery(symbol: string) {
    this.symbolSearchForm.reset();
    this.router.navigate(['/discovery', symbol]);
  }

  onClick(symbol: string) {
    if (this.navEndLocation == 'DiscoveryComponent') {
      this.gotoDiscovery(symbol);
    } else {
      this.gotoReport(symbol);
    }
  }

  onSubmit() {
    if (this.searchResults.length != 0) {
      if (this.navEndLocation == 'DiscoveryComponent') {
        this.gotoDiscovery(this.searchResults[0].Symbol);
      } else {
        this.gotoReport(this.searchResults[0].Symbol);
      }
    }
  }

  toggleFocus() {
    this.focus = !this.focus;
  }

  addToList(listId: string, symbol: string) {
    this.loading = this.ideasService.addStockIntoList(listId.toString(), symbol)
      .takeLast(1)
      .subscribe();
    this.symbolSearchService.emitAddToList();
  }

}
