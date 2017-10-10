import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {FormControl} from '@angular/forms';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SymbolSearchService} from '../../../core/services/symbol-search.service';

@Component({
  selector: 'cpt-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit()">
      <div class="form-group">
        <input (focusout)="toggleFocus()" (focus)="toggleFocus()" [formControl]="symbolSearchForm" type="search"
               class="form-control search-box"
               placeholder="Ticker or Company"
               aria-describedby="basic-addon1">
        <button type="submit" style="display:none">hidden submit</button>
      </div>
    </form>
    <div (mousedown)="$event.preventDefault();" *ngIf="searchResults && symbolSearchForm.value && focus == true"
         class="search__dropdown">
      <ul *ngFor="let result of searchResults" class="container">
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
          <div (click)="gotoDiscovery(result.Symbol)" class="col-1 search__action">
            <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_portfolio" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M107.142857,64 L192.857143,64 L192.857143,42.5 L107.142857,42.5 L107.142857,64 Z M300,171.5 L300,252.125 C300,266.90625 287.946429,279 273.214286,279 L26.7857143,279 C12.0535714,279 0,266.90625 0,252.125 L0,171.5 L112.5,171.5 L112.5,198.375 C112.5,204.253906 117.354911,209.125 123.214286,209.125 L176.785714,209.125 C182.645089,209.125 187.5,204.253906 187.5,198.375 L187.5,171.5 L300,171.5 Z M171.428571,171.5 L171.428571,193 L128.571429,193 L128.571429,171.5 L171.428571,171.5 Z M300,90.875 L300,155.375 L0,155.375 L0,90.875 C0,76.09375 12.0535714,64 26.7857143,64 L85.7142857,64 L85.7142857,37.125 C85.7142857,28.2226562 92.9129464,21 101.785714,21 L198.214286,21 C207.087054,21 214.285714,28.2226562 214.285714,37.125 L214.285714,64 L273.214286,64 C287.946429,64 300,76.09375 300,90.875 Z"></path>
              </g>
            </svg>
          </div>
          <div (click)="gotoReport(result.Symbol)" class="col-1 search__action">
            <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_watching" stroke="none" stroke-width="1" fill="#000000" fill-rule="evenodd">
                <path
                  d="M117.857143,53.5714286 L46.875,53.5714286 C44.53125,53.5714286 42.3549107,55.078125 41.6852679,57.421875 L0,203.571429 L0,289.285714 C0,295.145089 4.85491071,300 10.7142857,300 L96.4285714,300 C102.287946,300 107.142857,295.145089 107.142857,289.285714 L107.142857,192.857143 C113.002232,192.857143 117.857143,188.002232 117.857143,182.142857 L117.857143,53.5714286 Z M171.428571,53.5714286 L128.571429,53.5714286 L128.571429,171.428571 L171.428571,171.428571 L171.428571,53.5714286 Z M300,203.571429 L258.314732,57.421875 C257.645089,55.078125 255.46875,53.5714286 253.125,53.5714286 L182.142857,53.5714286 L182.142857,182.142857 C182.142857,188.002232 186.997768,192.857143 192.857143,192.857143 L192.857143,289.285714 C192.857143,295.145089 197.712054,300 203.571429,300 L289.285714,300 C295.145089,300 300,295.145089 300,289.285714 L300,203.571429 Z M123.214286,5.35714286 C123.214286,2.34375 120.870536,0 117.857143,0 L69.6428571,0 C66.6294643,0 64.2857143,2.34375 64.2857143,5.35714286 L64.2857143,42.8571429 L123.214286,42.8571429 L123.214286,5.35714286 Z M235.714286,5.35714286 C235.714286,2.34375 233.370536,0 230.357143,0 L182.142857,0 C179.129464,0 176.785714,2.34375 176.785714,5.35714286 L176.785714,42.8571429 L235.714286,42.8571429 L235.714286,5.35714286 Z"></path>
              </g>
            </svg>
          </div>
        </li>
      </ul>
      <ul *ngIf="searchResults && symbolSearchForm.value && searchResults.length == 0">
        <li>
          <p class="search__none">There is no such symbol</p>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SymbolSearchComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private navEndLocation: string;
  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public focus: boolean = false;

  constructor(private router: Router,
              private symbolSearchService: SymbolSearchService) {
    this.symbolSearchForm = new FormControl();

    router.events
      .filter(e => e instanceof NavigationEnd)
      .forEach(e => this.navEndLocation = router.routerState.root.firstChild.component['name']);
  }

  ngOnInit() {
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
    console.log('location', this.navEndLocation);

    if (this.navEndLocation == 'DashboardComponent') {
      this.router.navigate(['/report', symbol]);
    }
    if (this.navEndLocation == 'StockReportComponent') {

    }
    if (this.navEndLocation == 'DiscoveryComponent') {

    }
    this.symbolSearchForm.reset();
  }

  onSubmit() {
    if (this.searchResults.length != 0) {
      this.gotoReport(this.searchResults[0].Symbol);
      this.symbolSearchForm.reset();
    }
  }

  toggleFocus() {
    this.focus = !this.focus;
  }

}
