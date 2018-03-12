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

interface SearchResult {
  Symbol: string,
  CompanyName: string,
  is_etf: boolean
}

@Component({
  selector: 'cpt-psp-symbol-search',
  template: `
    <form class="form-inline" (submit)="onSubmit(symbolSearchForm.value)">
      <div class="form-group">
        <mat-form-field>
          <input matInput [formControl]="symbolSearchForm"
                 type="search"
                 class="search-box"
                 placeholder="Search and Add"
                 [matAutocomplete]="auto"
                 #autoCompleteInput
                 aria-describedby="basic-addon1">
          <mat-autocomplete #auto="matAutocomplete" class="search__dropdown">
            <mat-optgroup *ngIf="!searchResults.length" [label]="'opt group 1'">
              <mat-option (click)="onClick(result.Symbol)" *ngFor="let result of searchSuggestions" [value]="result.Symbol">
                <span class="ticker">{{ result.Symbol }}</span>
                <span class="company">{{ result.CompanyName }}</span>
                <div *ngIf="!resultInUserList(userStocks, result.Symbol)"
                    (click)="addToList(result.Symbol);$event.stopPropagation()" class="search__action">
                  <p class=""><i class="far fa-plus-circle"></i> &nbsp;Add</p>
                </div>
                <div *ngIf="resultInUserList(userStocks, result.Symbol)"
                     (click)="removeStock(result.Symbol);$event.stopPropagation()" class="search__action">
                  <p class=""><i class="far fa-minus-circle"></i> &nbsp;Remove</p>
                </div>
              </mat-option>
            </mat-optgroup>
            <mat-optgroup *ngIf="searchResults.length" [label]="'opt group 2'">
              <mat-option (click)="onClick(result.Symbol)" *ngFor="let result of searchResults" [value]="result.Symbol">
                <span class="ticker">{{ result.Symbol }}</span>
                <span class="company">{{ result.CompanyName }}</span>
                <div *ngIf="!resultInUserList(userStocks, result.Symbol)"
                    (click)="addToList(result.Symbol);$event.stopPropagation()" class="search__action">
                  <p class=""><i class="far fa-plus-circle"></i> &nbsp;Add</p>
                </div>
                <div *ngIf="resultInUserList(userStocks, result.Symbol)"
                     (click)="removeStock(result.Symbol);$event.stopPropagation()" class="search__action">
                  <p class=""><i class="far fa-minus-circle"></i> &nbsp;Remove</p>
                </div>
              </mat-option>
            </mat-optgroup>
          </mat-autocomplete>
          <button class="search-submit" type="submit">
            <i class="far fa-search" aria-hidden="true"></i>
            <button mat-icon-button *ngIf="autoCompleteInput.value" matSuffix mat-icon-button aria-label="Clear" (click)="search.value=''">
              <mat-icon>close</mat-icon>            
            </button>
          </button>
        </mat-form-field>
      </div>
    </form>
  `,
  styleUrls: ['./psp-symbol-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PspSymbolSearchComponent extends BaseSymbolSearchComponent implements AfterViewInit, OnDestroy {
  @Input('placeholder') placeholder: string;
  @Input('btn') btn: HTMLElement;

  @ViewChild('autoCompleteInput', {read: MatAutocompleteTrigger}) autoCompleteInput: MatAutocompleteTrigger;

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
  public searchSuggestions: Array<SearchResult> = [
    {
      Symbol: 'FB',
      CompanyName: 'Facebook',
      is_etf: false
    },
    {
      Symbol: 'NFLX',
      CompanyName: 'Netflix',
      is_etf: false
    },
    {
      Symbol: 'AMZN',
      CompanyName: 'Amazon',
      is_etf: false
    }
  ];

  constructor(public authService: AuthService,
              public ideasService: IdeasService,
              public symbolSearchService: SymbolSearchService,
              public router: Router,
              private healthCheck: HealthCheckService,
              private el: ElementRef) {
    super(authService, ideasService, symbolSearchService, router);
    this.symbolSearchForm = new FormControl();
  }

  ngAfterViewInit() {
    this.loading = this.authService.currentUser$
      .map(usr => {
        console.log('usr', usr);
        this._uid = usr['UID']
      })
      .filter(x => x != undefined)
      .map(res => this._listId = this.authService.userLists[0]['User Lists'].filter(x => x['name'] == this.healthCheck.currentList)[0]['list_id'])
      .switchMap(listId => {
        console.log('listId', listId);
        return this.healthCheck.getListSymbols(listId, this._uid)
      })
      .subscribe(res => {
        console.log('userStocks', res['symbols']);
        this.userStocks = res['symbols'];
      });
    // this.loading = this.authService.currentUser$
    //   .map(usr => this._uid = usr['UID'])
    //   .map(res => this._listId = this.authService.userLists[0]['User Lists'].filter(x => x['name'] == this.healthCheck.currentList)[0]['list_id'])
    //   .switchMap(listId => {
    //     return this.healthCheck.getListSymbols(listId, this._uid)
    //   })
    //   .takeUntil(this.ngUnsubscribe)
    //   .subscribe(res => {
    //     this.userStocks = res['symbols'];
    //   })

    this.symbolSearchService.isOpen.subscribe(res => {
      console.log('res', res);
      res === true ? this.openAutoComplete() : this.closeAutoComplete();
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
    console.log('open');
    this.autoCompleteInput.openPanel();
  }

  closeAutoComplete() {
    console.log('close');
    this.autoCompleteInput.closePanel();
  }



}
