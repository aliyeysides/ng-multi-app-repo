import {
  AfterContentInit, Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ViewChild,
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
        <li (click)="onClick(result.Symbol)" class="row search__entry"
            [ngClass]="{'search--match': result.Symbol == symbolSearchForm.value.toUpperCase() }">
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
          <div *ngIf="!resultInUserList(userStocks, result.Symbol)" (click)="addToList(result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <img class="align-middle" src="./assets/imgs/icon_plus--white.svg">
          </div>
          <div *ngIf="resultInUserList(userStocks, result.Symbol)" (click)="removeStock(result.Symbol);$event.stopPropagation()" class="col-1 search__action">
            <img class="align-middle" src="./assets/imgs/icon_minus.svg">
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
export class PspSymbolSearchComponent extends BaseSymbolSearchComponent implements AfterContentInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @Input('btn') btn: HTMLElement;
  @ViewChild('search') search: ElementRef;
  @Output('focused') focused: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output('toggleSearch') toggleSearch: EventEmitter<boolean> = new EventEmitter<boolean>();

  @HostListener('document:click', ['$event']) offClick(e: Event) {
    e.stopPropagation();
    if (!this.el.nativeElement.contains(e.target) && !this.btn.contains(e.target as Node)) {
      this.toggleSearch.emit();
    }
  }

  private _listId: string;
  private _uid: string;

  public symbolSearchForm: FormControl;
  public searchResults: Array<any>;
  public userStocks: ListSymbolObj[];

  public loading: Subscription;

  constructor(public router: Router,
              public authService: AuthService,
              public ideasService: IdeasService,
              public symbolSearchService: SymbolSearchService,
              private healthCheck: HealthCheckService,
              private el: ElementRef) {
    super(router, authService, ideasService, symbolSearchService);
    this.symbolSearchForm = new FormControl();
  }

  ngOnInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .switchMap(uid => this.healthCheck.getAuthorizedLists(uid))
      .map(res => this._listId = res[0]['User Lists'][0]['list_id'])
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
      })
  }

  ngAfterContentInit() {
    this.search.nativeElement.focus();
    this.searchResults = [];
    this.symbolSearchForm.valueChanges
      .debounceTime(500)
      .switchMap(val => this.symbolSearchService.symbolLookup(val))
      .takeUntil(this.ngUnsubscribe)
      .subscribe(val => {
        this.searchResults = val;
      });
  }

  onSubmit(ticker: string) {
    this.router.navigate(['my-stocks', ticker.toUpperCase()]);
    this.toggleSearch.emit();
  }

  addToList(ticker: string) {
    this.ideasService.addStockIntoList(this._listId.toString(), ticker)
      .take(1)
      .subscribe(res => {
        this.healthCheck.updateMyStocksList();
        this.toggleSearch.emit();
      });
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
    this.router.navigate(['my-stocks', ticker]);
    this.toggleSearch.emit();
  }

  resultInUserList(arr: ListSymbolObj[], ticker: string): boolean {
    if (arr) {
      return arr.filter(x => x['symbol'] == ticker).length > 0;
    }
  }

}
