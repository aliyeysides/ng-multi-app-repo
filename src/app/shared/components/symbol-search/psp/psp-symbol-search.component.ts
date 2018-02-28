import {Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {SymbolSearchService} from '../../../../services/symbol-search.service';
import {IdeasService} from '../../../../services/ideas.service';
import {AuthService} from '../../../../services/auth.service';
import {Subscription} from 'rxjs/Subscription';
import {BaseSymbolSearchComponent} from '../symbol-search.component';
import {HealthCheckService} from '../../../../services/health-check.service';
import {ListSymbolObj} from '../../../models/health-check';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit(symbolSearchForm.value)">
      <div class="form-group">
        <input #search (focusout)="toggleFocus()" (focus)="toggleFocus()" [formControl]="symbolSearchForm" type="search"
               class="form-control search-box"
               placeholder="{{ placeholder }}"
               aria-describedby="basic-addon1">
        <button type="submit"><i (click)="search.focus()" class="fa fa-search" aria-hidden="true"></i></button>
      </div>
    </form>
    <div (mousedown)="$event.preventDefault();" *ngIf="searchResults && symbolSearchForm.value && focus == true"
         class="search__dropdown">
      <ul [ngBusy]="loading" *ngFor="let result of searchResults" class="container">
        <li (click)="onClick(result.Symbol)" class="row no-gutters search__entry"
            [ngClass]="{'search--match': result.Symbol == symbolSearchForm.value.toUpperCase() }">
          <div class="col-3 search__company">
            <p class="company-ticker">
              {{ result.Symbol }}
            </p>
          </div>
          <div class="col-8">
            <p class="company-name">
              {{ result.CompanyName }}
            </p>
          </div>
          <div *ngIf="!resultInUserList(userStocks, result.Symbol)" (click)="addToList(result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <svg class="align-absolute" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="Add-Stock" stroke="none" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd">
                  <g id="" transform="translate(-344.000000, -54.000000)" fill-rule="nonzero">
                    <path d="M365.428571,55.7142857 C365.9,55.7142857 366.285714,56.1 366.285714,56.5714286 L366.285714,75.4285714 C366.285714,75.9 365.9,76.2857143 365.428571,76.2857143 L346.571429,76.2857143 C346.1,76.2857143 345.714286,75.9 345.714286,75.4285714 L345.714286,56.5714286 C345.714286,56.1 346.1,55.7142857 346.571429,55.7142857 L365.428571,55.7142857 L365.428571,55.7142857 Z M365.428571,54 L346.571429,54 C345.151786,54 344,55.1517857 344,56.5714286 L344,75.4285714 C344,76.8482143 345.151786,78 346.571429,78 L365.428571,78 C366.848214,78 368,76.8482143 368,75.4285714 L368,56.5714286 C368,55.1517857 366.848214,54 365.428571,54 Z M362.214286,65.0357143 L356.964286,65.0357143 L356.964286,59.7857143 C356.964286,59.4321429 356.675,59.1428571 356.321429,59.1428571 L355.678571,59.1428571 C355.325,59.1428571 355.035714,59.4321429 355.035714,59.7857143 L355.035714,65.0357143 L349.785714,65.0357143 C349.432143,65.0357143 349.142857,65.325 349.142857,65.6785714 L349.142857,66.3214286 C349.142857,66.675 349.432143,66.9642857 349.785714,66.9642857 L355.035714,66.9642857 L355.035714,72.2142857 C355.035714,72.5678571 355.325,72.8571429 355.678571,72.8571429 L356.321429,72.8571429 C356.675,72.8571429 356.964286,72.5678571 356.964286,72.2142857 L356.964286,66.9642857 L362.214286,66.9642857 C362.567857,66.9642857 362.857143,66.675 362.857143,66.3214286 L362.857143,65.6785714 C362.857143,65.325 362.567857,65.0357143 362.214286,65.0357143 Z" id="Shape"></path>
                </g>
              </g>
            </svg>
          </div>
          <div *ngIf="resultInUserList(userStocks, result.Symbol)" (click)="removeStock(result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <svg class="align-absolute" width="30px" height="30px" viewBox="0 0 30 30" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <defs></defs>
              <g id="Minus-Stock" stroke="none" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd">
                <g id="" transform="translate(-18.000000, -451.000000)" fill-rule="nonzero" fill="#FFFFFF">
                    <path d="M44.7857143,453.142857 C45.375,453.142857 45.8571429,453.625 45.8571429,454.214286 L45.8571429,477.785714 C45.8571429,478.375 45.375,478.857143 44.7857143,478.857143 L21.2142857,478.857143 C20.625,478.857143 20.1428571,478.375 20.1428571,477.785714 L20.1428571,454.214286 C20.1428571,453.625 20.625,453.142857 21.2142857,453.142857 L44.7857143,453.142857 L44.7857143,453.142857 Z M44.7857143,451 L21.2142857,451 C19.4397321,451 18,452.439732 18,454.214286 L18,477.785714 C18,479.560268 19.4397321,481 21.2142857,481 L44.7857143,481 C46.5602679,481 48,479.560268 48,477.785714 L48,454.214286 C48,452.439732 46.5602679,451 44.7857143,451 Z M40.7678571,464.794643 L34.2053571,464.794643 L31.7946429,464.794643 L25.2321429,464.794643 C24.7901786,464.794643 24.4285714,465.15625 24.4285714,465.598214 L24.4285714,466.401786 C24.4285714,466.84375 24.7901786,467.205357 25.2321429,467.205357 L31.7946429,467.205357 L34.2053571,467.205357 L40.7678571,467.205357 C41.2098214,467.205357 41.5714286,466.84375 41.5714286,466.401786 L41.5714286,465.598214 C41.5714286,465.15625 41.2098214,464.794643 40.7678571,464.794643 Z" id="Shape"></path>
                </g>
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
  styleUrls: ['./psp-symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PspSymbolSearchComponent extends BaseSymbolSearchComponent implements OnDestroy {
  @Input('placeholder') placeholder: string;
  @Input('btn') btn: HTMLElement;
  @ViewChild('search') search: ElementRef;
  @Output('focused') focused: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('toggleSearch') toggleSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    e.preventDefault();
    if (!this.el.nativeElement.contains(e.target) && !this.btn.contains(e.target as Node)) {
      this.toggleSearch.emit();
      return;
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnter(e: KeyboardEvent) {
    this.searchResults.length ? this.onSubmit(this.searchResults[0].Symbol) : null;
  }

  private _listId: string;
  private _uid: string;

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public userStocks: ListSymbolObj[];

  public loading: Subscription;

  constructor(public authService: AuthService,
              public ideasService: IdeasService,
              public symbolSearchService: SymbolSearchService,
              private healthCheck: HealthCheckService,
              private el: ElementRef,
              public router: Router,) {
    super(authService, ideasService, symbolSearchService, router);
    this.symbolSearchForm = new FormControl();
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .map(res => this._listId = this.authService.userLists[0]['User Lists'].filter(x => x['name'] == this.healthCheck.currentList)[0]['list_id'])
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
      })
  }

  onSubmit(ticker: string) {
    this.router.navigate(['stock-analysis', ticker.toUpperCase()]);
    this.toggleSearch.emit();
    gtag('event', 'search', {'search_term': ticker});
  }

  addToList(ticker: string) {
    this.ideasService.addStockIntoList(this._listId.toString(), ticker)
      .take(1)
      .subscribe(res => {
        this.healthCheck.updateMyStocksList();
        this.router.navigate(['stock-analysis', ticker]);
        this.toggleSearch.emit();
      });
    gtag('event', 'search', {'search_term': ticker});
  }

  removeStock(ticker: string) {
    this.ideasService.deleteSymbolFromList(this._listId, ticker)
      .take(1)
      .subscribe(res => {
        this.healthCheck.updateMyStocksList();
        this.toggleSearch.emit();
      });
  }

  onClick(ticker: string) {
    this.router.navigate(['stock-analysis', ticker]);
    this.toggleSearch.emit();
    gtag('event', 'search', {'search_term': ticker});
  }

  resultInUserList(arr: ListSymbolObj[], ticker: string): boolean {
    if (arr) {
      return arr.filter(x => x['symbol'] == ticker).length > 0;
    }
  }

}
