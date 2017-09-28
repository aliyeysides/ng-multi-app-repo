import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';

import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
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
        <li class="row search__entry">
          <div class="col-lg-5 col-xl-3 search__company">
            <p class="company-ticker">
              {{ result.Symbol }}
            </p>
          </div>
          <div class="col-lg-6 col-xl-8">
            <p class="company-name">
              {{ result.CompanyName }}
            </p>
          </div>
          <div (click)="gotoDiscovery(result.Symbol)" class="col-lg-1 col-xl-1
       search__action">
            <img src="assets/imgs/icon_discovery.svg">
          </div>
          <div (click)="gotoReport(result.Symbol)" class="col-lg-1 col-xl-1
       search__action">
            <svg class="align-absolute" width="300px" height="300px" viewBox="0 0 300 300" version="1.1"
                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="icon_stockview" fill="#000000" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path
                  d="M266.170047,186.953716 C270.088277,186.953716 273.264617,190.130068 273.264617,194.048311 L273.264617,292.906419 C273.264617,296.824662 270.088277,300.001014 266.170047,300.001014 L7.09457063,300.001014 C3.17836764,300.001014 0,296.824662 0,292.906419 L0,33.8280405 C0,29.9097973 3.17836764,26.7334459 7.09457063,26.7334459 L105.954372,26.7334459 C109.872602,26.7334459 113.048942,29.9097973 113.048942,33.8280405 L113.048942,61.1016892 C113.048942,65.0199324 109.872602,68.1962838 105.954372,68.1962838 L41.4626978,68.1962838 L41.4626978,258.536149 L231.803947,258.536149 L231.803947,194.048311 C231.803947,190.130068 234.980287,186.953716 238.898517,186.953716 L266.170047,186.953716 Z M292.905429,0 C296.823659,0 300,3.17635135 300,7.09459459 L300,149.586486 C300,153.50473 296.823659,156.681081 292.905429,156.681081 L266.17106,156.681081 C262.25283,156.681081 259.07649,153.50473 259.07649,149.586486 L259.07649,69.8614865 L160.553174,168.383108 C159.223449,169.712838 157.419401,170.460811 155.536299,170.460811 L136.632309,170.460811 C132.716106,170.460811 129.537738,167.284459 129.537738,163.366216 L129.537738,144.464189 C129.537738,142.581081 130.285708,140.777027 131.617461,139.44527 L230.13875,40.9236486 L150.411992,40.9236486 C146.495789,40.9236486 143.317421,37.7472973 143.317421,33.8290541 L143.317421,7.09459459 C143.317421,3.17635135 146.495789,0 150.411992,0 L292.905429,0 Z"></path>
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

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public focus: boolean = false;

  constructor(private router: Router,
              private symbolSearchService: SymbolSearchService) {
    this.symbolSearchForm = new FormControl();
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
    this.router.navigate(['/report', symbol]);
  }

  gotoDiscovery(symbol: string) {
    this.router.navigate(['/discovery', symbol]);
  }

  onSubmit() {
    this.gotoReport(this.searchResults[0].Symbol);
    this.symbolSearchForm.reset();
  }

  toggleFocus() {
    this.focus = !this.focus;
  }

}
