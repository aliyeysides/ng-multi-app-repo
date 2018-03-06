import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
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
import {MatAutocompleteTrigger} from '@angular/material';

declare let gtag: Function;

@Component({
  selector: 'cpt-psp-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit(symbolSearchForm.value)">
      <div class="form-group">
        <mat-form-field>
          <input matInput #search (focusout)="toggleFocus()" (focus)="toggleFocus()" [formControl]="symbolSearchForm"
                 type="search"
                 class="search-box"
                 placeholder="{{ placeholder }}"
                 [matAutocomplete]="auto"
                 aria-describedby="basic-addon1">
          <mat-autocomplete #auto="matAutocomplete">
            <mat-optgroup *ngIf="!searchResults.length">
              <mat-option>
                FACEBOOK
              </mat-option>
            </mat-optgroup>
            <mat-optgroup *ngIf="searchResults.length">
              <mat-option *ngFor="let result of searchResults" [value]="result.CompanyName">
                {{ result.Symbol }}
                {{ result.CompanyName }}
              </mat-option>
            </mat-optgroup>
          </mat-autocomplete>
          <button class="search-submit" type="submit">
            <!--<i (click)="search.focus()" class="fa fa-search" aria-hidden="true"></i>-->
            <button mat-icon-button *ngIf="search.value" matSuffix mat-icon-button aria-label="Clear" (click)="search.value=''">
              <mat-icon>close</mat-icon>            
            </button>
          </button>
        </mat-form-field>
      </div>
    </form>
    <!--<div (mousedown)="$event.preventDefault();" *ngIf="searchResults && symbolSearchForm.value && focus == true"-->
         <!--class="search__dropdown">-->
      <!--<ul [ngBusy]="loading" *ngFor="let result of searchResults" class="container">-->
        <!--<li (click)="onClick(result.Symbol)" class="row no-gutters search__entry"-->
            <!--[ngClass]="{'search&#45;&#45;match': result.Symbol == symbolSearchForm.value.toUpperCase() }">-->
          <!--<div class="col-3 search__company">-->
            <!--<p class="company-ticker">-->
              <!--{{ result.Symbol }}-->
            <!--</p>-->
          <!--</div>-->
          <!--<div class="col-6">-->
            <!--<p class="company-name">-->
              <!--{{ result.CompanyName }}-->
            <!--</p>-->
          <!--</div>-->
          <!--<div *ngIf="!resultInUserList(userStocks, result.Symbol)"-->
               <!--(click)="addToList(result.Symbol);$event.stopPropagation()" class="col-3 search__action">-->
            <!--<p class="align-absolute"><i class="far fa-plus-circle"></i> &nbsp; Add stock</p>-->
          <!--</div>-->
          <!--<div *ngIf="resultInUserList(userStocks, result.Symbol)"-->
               <!--(click)="removeStock(result.Symbol);$event.stopPropagation()" class="col-3 search__action">-->
            <!--<p class="align-absolute"><i class="far fa-minus-circle"></i> &nbsp; Remove stock</p>-->
          <!--</div>-->
        <!--</li>-->
      <!--</ul>-->
      <!--<ul *ngIf="searchResults && symbolSearchForm.value && searchResults.length == 0">-->
        <!--<li>-->
          <!--<p class="search__none">Symbol not found</p>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</div>-->
  `,
  styleUrls: ['./psp-symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PspSymbolSearchComponent extends BaseSymbolSearchComponent implements AfterViewInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @Input('btn') btn: HTMLElement;

  @ViewChild('search') search: ElementRef;
  @ViewChild('auto') auto: MatAutocompleteTrigger;

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

  ngAfterViewInit() {
    this.loading = this.authService.currentUser$
      .map(usr => this._uid = usr['UID'])
      .map(res => this._listId = this.authService.userLists[0]['User Lists'].filter(x => x['name'] == this.healthCheck.currentList)[0]['list_id'])
      .switchMap(listId => {
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .take(1)
      .subscribe(res => {
        this.userStocks = res['symbols'];
      });
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

  openAutoComplete() {
    this.auto.openPanel();
  }

}
